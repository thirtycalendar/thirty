import OpenAI from "openai";

import { countries } from "$lib/server/libs/calendarific/countries";
import { kv, kvHoliday } from "$lib/server/libs/upstash/kv";
import { createVectorClient, vector } from "$lib/server/libs/upstash/vector";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";
import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import {
  KV_ALL_HOLIDAY_COUNTRIES,
  KV_COUNTRY_HOLIDAYS,
  KV_HOLIDAY_COUNTRIES,
  KV_HOLIDAYS
} from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

const allCountries = countries.flat();
const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1); // Past 1 year
const TO = new Date(YEAR + 3, 11, 31); // Next 3 years

function isWithinRange(date: Date): boolean {
  return date >= FROM && date <= TO;
}

const holidayVectorClient = createVectorClient<Holiday>({
  openai: new OpenAI({ apiKey: openAiEnvConfig.apiKey }),
  vector
});

export const holidayCountryVectorClient = createVectorClient<HolidayCountry>({
  openai: new OpenAI({ apiKey: openAiEnvConfig.apiKey }),
  vector,
  metadataFn: (country: HolidayCountry): Record<string, unknown> => ({
    countryCode: country.countryCode,
    countryName: country.countryName
  })
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
  async getAllHolidayCountries(): Promise<HolidayCountry[]> {
    return (await kvHoliday.get<HolidayCountry[]>(KV_ALL_HOLIDAY_COUNTRIES)) ?? [];
  },

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
      await holidayVectorClient.upsertBulk(holidaysForNewCountry);
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
      await holidayVectorClient.delete(holidaysToRemove.map((h) => h.id));
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
    const filter: Record<string, string> = {};
    if (countryCode) {
      filter.countryCode = countryCode;
    }

    const results = await holidayVectorClient.query(query, {
      topK: limit,
      filter
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

  async searchAllHolidayCountries(query: string, limit = 10): Promise<HolidayCountry[]> {
    const results = await holidayCountryVectorClient.query(query, {
      topK: limit
    });

    const countryIds = results.map((r) => r.id);
    if (!countryIds.length) return [];

    const allHolidayCountries = await this.getAllHolidayCountries();

    const orderedCountries = results
      .map((r) => allHolidayCountries.find((c) => c.id === String(r.id)))
      .filter(Boolean) as HolidayCountry[];

    return orderedCountries;
  },

  async searchCountryVector(
    query: string,
    countryCode?: string,
    limit = 10
  ): Promise<{ id: string; score: number }[]> {
    const filter: Record<string, string> = {};
    if (countryCode) {
      filter.countryCode = countryCode;
    }

    return await holidayVectorClient.query(query, {
      topK: limit,
      filter
    });
  },

  async upsertCountryVector(holiday: Holiday): Promise<void> {
    await holidayVectorClient.upsert(holiday);
  },

  async upsertCountryVectorBulk(holidays: Holiday[]): Promise<void> {
    await holidayVectorClient.upsertBulk(holidays);
  },

  async deleteCountryVector(id: string): Promise<void> {
    await holidayVectorClient.delete(id);
  }
};
