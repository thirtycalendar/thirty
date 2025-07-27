// src/lib/server/services/holiday.ts
import OpenAI, { APIError } from "openai";

import { countries } from "$lib/server/libs/calendarific/countries";
import { kv, kvHoliday } from "$lib/server/libs/upstash/kv";
import { vector } from "$lib/server/libs/upstash/vector";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";
import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_COUNTRY_HOLIDAYS, KV_HOLIDAY_COUNTRIES, KV_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

export class VectorNotConfiguredError extends Error {
  constructor() {
    super("Vector search not configured: Missing vector or OpenAI instance.");
    this.name = "VectorNotConfiguredError";
  }
}

const allCountries = countries.flat();
const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1); // Past 1 year
const TO = new Date(YEAR + 3, 11, 31); // Next 3 years

function isWithinRange(date: Date): boolean {
  return date >= FROM && date <= TO;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function retryWithBackoff<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  args: Parameters<F>,
  retries = 5,
  delay = 1000
): Promise<Awaited<ReturnType<F>>> {
  try {
    return await fn(...args);
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof APIError &&
      (error.status === 429 || error.status === 503)
    ) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, args, retries - 1, delay * 2);
    }
    throw error;
  }
}

const openai = new OpenAI({ apiKey: openAiEnvConfig.apiKey });
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";

const getHolidayTextForEmbedding = (holiday: Holiday): string => {
  return `${holiday.name} ${holiday.description || ""} holiday in ${holiday.countryCode} on ${holiday.date}`;
};

const getHolidayMetadata = (holiday: Holiday): Record<string, unknown> => ({
  countryCode: holiday.countryCode,
  date: holiday.date
});

async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]): Promise<void> {
  await kv.set(KV_HOLIDAY_COUNTRIES(userId), list);
  await updateHolidaysCache(userId, list);
}

async function updateHolidaysCache(
  userId: string,
  countries: HolidayCountry[]
): Promise<Holiday[]> {
  const allHolidays: Holiday[] = [];
  const results = await Promise.allSettled(
    countries.map((c) => kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(c.id)))
  );
  for (const r of results) {
    if (r.status === "fulfilled" && r.value?.length) {
      allHolidays.push(...r.value.filter((h) => isWithinRange(new Date(h.date))));
    }
  }
  await kv.set(KV_HOLIDAYS(userId), allHolidays, { ex: kvCacheTimes.holiday });
  return allHolidays;
}

export const holidayService = {
  async getHolidays(userId: string): Promise<Holiday[]> {
    const cached = await kv.get<Holiday[]>(KV_HOLIDAYS(userId));
    if (cached) return cached;

    const userCountries = await this.getCountries(userId);
    return await updateHolidaysCache(userId, userCountries);
  },

  async getCountries(userId: string): Promise<HolidayCountry[]> {
    return (await kv.get<HolidayCountry[]>(KV_HOLIDAY_COUNTRIES(userId))) ?? [];
  },

  async addCountry(userId: string, input: HolidayCountryForm): Promise<HolidayCountry> {
    const matchedCountry = allCountries.find((c) => c.id === input.id);
    if (!matchedCountry) throw new Error("Invalid country id");

    const currentCountries = await this.getCountries(userId);
    if (currentCountries.some((c) => c.id === matchedCountry.id)) return matchedCountry;

    const updatedCountries = [...currentCountries, matchedCountry];
    await cacheUserHolidayCountries(userId, updatedCountries);

    const holidaysForNewCountry =
      (await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(matchedCountry.id))) || [];
    if (holidaysForNewCountry.length > 0) {
      await this.upsertCountryVectorBulk(holidaysForNewCountry);
    }

    return matchedCountry;
  },

  async addCountryByCode(userId: string, code: string): Promise<HolidayCountry | undefined> {
    const matchedCountry = allCountries.find(
      (c) => c.countryCode.toLowerCase() === code.toLowerCase()
    );
    return matchedCountry ? await this.addCountry(userId, { id: matchedCountry.id }) : undefined;
  },

  async removeCountry(userId: string, countryId: string): Promise<HolidayCountry> {
    const currentCountries = await this.getCountries(userId);
    const index = currentCountries.findIndex((c) => c.id === countryId);
    if (index === -1) throw new Error("Holiday country not found");

    const [removed] = currentCountries.splice(index, 1);
    await cacheUserHolidayCountries(userId, currentCountries);

    const holidaysToRemove =
      (await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(removed.id))) || [];
    if (holidaysToRemove.length > 0) {
      await Promise.all(holidaysToRemove.map((h) => this.deleteCountryVector(h.id)));
    }

    return removed;
  },

  async clearCache(userId: string): Promise<void> {
    await kv.del(KV_HOLIDAY_COUNTRIES(userId), KV_HOLIDAYS(userId));
  },

  async searchCountries(
    query: string,
    userId: string,
    countryCode?: string,
    limit = 10
  ): Promise<Holiday[]> {
    if (!vector || !openai) throw new VectorNotConfiguredError();

    const queryEmbResponse = await retryWithBackoff(
      openai.embeddings.create.bind(openai.embeddings),
      [{ model: OPENAI_EMBEDDING_MODEL, input: query }]
    );

    const filter: Record<string, string> = {};
    if (countryCode) {
      filter.countryCode = countryCode;
    }

    const results = await vector.query({
      vector: queryEmbResponse.data[0].embedding,
      topK: limit,
      filter:
        Object.keys(filter).length > 0
          ? Object.entries(filter)
              .map(([key, value]) => `${key}='${value}'`)
              .join(" and ")
          : undefined
    });

    const holidayIds = results.map((r) => r.id);
    if (!holidayIds.length) return [];

    const userSubscribedCountries = await this.getCountries(userId);
    const userCountryCodes = new Set(userSubscribedCountries.map((c) => c.countryCode));

    const allKnownHolidays: Holiday[] = [];
    for (const country of userSubscribedCountries) {
      const countryHolidays = await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(country.id));
      if (countryHolidays) {
        allKnownHolidays.push(...countryHolidays);
      }
    }

    const orderedHolidays = results
      .map((r) =>
        allKnownHolidays.find((h) => h.id === String(r.id) && userCountryCodes.has(h.countryCode))
      )
      .filter(Boolean) as Holiday[];

    return orderedHolidays;
  },

  async searchCountryVector(
    query: string,
    countryCode?: string,
    limit = 10
  ): Promise<{ id: string; score: number }[]> {
    if (!vector || !openai) throw new VectorNotConfiguredError();

    const queryEmbResponse = await retryWithBackoff(
      openai.embeddings.create.bind(openai.embeddings),
      [{ model: OPENAI_EMBEDDING_MODEL, input: query }]
    );

    const filter: Record<string, string> = {};
    if (countryCode) {
      filter.countryCode = countryCode;
    }

    const results = await vector.query({
      vector: queryEmbResponse.data[0].embedding,
      topK: limit,
      filter:
        Object.keys(filter).length > 0
          ? Object.entries(filter)
              .map(([key, value]) => `${key}='${value}'`)
              .join(" and ")
          : undefined
    });
    return results.map((r) => ({ id: String(r.id), score: r.score ?? 0 }));
  },

  async upsertCountryVector(holiday: Holiday): Promise<void> {
    if (!vector || !openai) return;

    const text = getHolidayTextForEmbedding(holiday);
    if (!text) return;

    const embeddingResponse = await retryWithBackoff(
      openai.embeddings.create.bind(openai.embeddings),
      [{ model: OPENAI_EMBEDDING_MODEL, input: text }]
    );

    await vector.upsert({
      id: holiday.id,
      vector: embeddingResponse.data[0].embedding,
      metadata: getHolidayMetadata(holiday)
    });
  },

  async upsertCountryVectorBulk(holidays: Holiday[]): Promise<void> {
    if (!vector || !openai || holidays.length === 0) return;

    const BATCH_SIZE = 50;
    for (let i = 0; i < holidays.length; i += BATCH_SIZE) {
      const batch = holidays.slice(i, i + BATCH_SIZE);
      const texts = batch.map(getHolidayTextForEmbedding).filter(Boolean) as string[];

      if (!texts.length) continue;

      const embeddingResponse = await retryWithBackoff(
        openai.embeddings.create.bind(openai.embeddings),
        [{ model: OPENAI_EMBEDDING_MODEL, input: texts }]
      );

      const vectorsToUpsert = embeddingResponse.data.map((item, index) => ({
        id: batch[index].id,
        vector: item.embedding,
        metadata: getHolidayMetadata(batch[index])
      }));
      await vector.upsert(vectorsToUpsert);
    }
  },

  async deleteCountryVector(id: string): Promise<void> {
    if (!vector) return;
    await vector.delete(id);
  }
};
