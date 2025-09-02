import { env } from "$env/dynamic/private";

import { countries } from "$lib/server/libs/calendarific/countries";
import { kv, kvCacheTimes, kvHoliday } from "$lib/server/libs/upstash/kv";
import { vector, vectorHoliday } from "$lib/server/libs/upstash/vector";

import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

import {
  KV_ALL_HOLIDAY_COUNTRIES,
  KV_COUNTRY_HOLIDAYS,
  KV_HOLIDAY_COUNTRIES,
  KV_HOLIDAYS
} from "../utils/kv-keys";
import { createVectorClient } from "../utils/vector-service";

const allCountries = countries.flat();
const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1); // Past 1 year
const TO = new Date(YEAR + 3, 11, 31); // Next 3 years

function isWithinRange(date: Date): boolean {
  return date >= FROM && date <= TO;
}

export const holidayCountryVectorClient = createVectorClient<HolidayCountry & { userId?: string }>({
  namespace: "holiday-country",
  voyageApiKey: env.VOYAGEAI_API_KEY,
  vector
});

export const allHolidayCountryVectorClient = createVectorClient<HolidayCountry>({
  namespace: "all-holiday-countries",
  voyageApiKey: env.VOYAGEAI_API_KEY,
  vector: vectorHoliday
});

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

    const userCountries = await holidayCountryService.getCountries(userId);
    return await updateHolidaysCache(userId, userCountries);
  }
};

async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]): Promise<void> {
  await kv.set(KV_HOLIDAY_COUNTRIES(userId), list);
  await updateHolidaysCache(userId, list);
}

export const holidayCountryService = {
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

    await holidayCountryVectorClient.upsert({ ...matchedCountry, userId });

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

    await holidayCountryVectorClient.delete(removed.id);

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
  ): Promise<HolidayCountry[]> {
    const filter: Record<string, string> = { userId };
    if (countryCode) {
      filter.countryCode = countryCode;
    }

    const results = await holidayCountryVectorClient.query(query, {
      topK: limit,
      filter
    });

    const countryIds = results.map((r) => r.id);
    if (!countryIds.length) return [];

    const userSubscribedCountries = await this.getCountries(userId);
    const userCountryIds = new Set(userSubscribedCountries.map((c) => c.id));

    const orderedCountries = results
      .map((r) =>
        userSubscribedCountries.find((c) => c.id === String(r.id) && userCountryIds.has(c.id))
      )
      .filter(Boolean) as HolidayCountry[];

    return orderedCountries;
  }
};

export const allHolidayCountriesService = {
  async getAllHolidayCountries(): Promise<HolidayCountry[]> {
    return (await kvHoliday.get<HolidayCountry[]>(KV_ALL_HOLIDAY_COUNTRIES)) ?? [];
  },

  async searchAllHolidayCountries(query: string, limit = 10): Promise<HolidayCountry[]> {
    const results = await allHolidayCountryVectorClient.query(query, {
      topK: limit
    });

    const countryIds = results.map((r) => r.id);
    if (!countryIds.length) return [];

    const allHolidayCountries = await this.getAllHolidayCountries();

    const orderedCountries = results
      .map((r) => allHolidayCountries.find((c) => c.id === String(r.id)))
      .filter(Boolean) as HolidayCountry[];

    return orderedCountries;
  }
};
