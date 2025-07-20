import { countries } from "$lib/server/libs/calendarific/countries";
import { kv, kvHoliday } from "$lib/server/libs/upstash/kv";

import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_COUNTRY_HOLIDAYS, KV_HOLIDAY_COUNTRIES, KV_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

const allCountries = countries.flat();

const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1); // Past 1 year
const TO = new Date(YEAR + 3, 11, 31); // Next 3 years

function isWithinRange(date: Date): boolean {
  return date >= FROM && date <= TO;
}

/**
 * Cache user's selected holiday countries and refresh aggregated holidays.
 */
async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]): Promise<void> {
  await kv.set(KV_HOLIDAY_COUNTRIES(userId), list);
  await updateHolidaysCache(userId, list);
}

/**
 * Update the user's aggregated holidays by merging all holidays
 * from the given countries and caching them.
 */
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
  /**
   * Get all aggregated holidays for a user, using cached data or rebuilding it.
   */
  async getHolidays(userId: string): Promise<Holiday[]> {
    const cached = await kv.get<Holiday[]>(KV_HOLIDAYS(userId));
    if (cached) return cached;

    const userCountries = await this.getCountries(userId);
    return await updateHolidaysCache(userId, userCountries);
  },

  /**
   * Get the list of holiday countries the user is subscribed to.
   */
  async getCountries(userId: string): Promise<HolidayCountry[]> {
    return (await kv.get<HolidayCountry[]>(KV_HOLIDAY_COUNTRIES(userId))) ?? [];
  },

  /**
   * Add a holiday country subscription by its `id`.
   */
  async addCountry(userId: string, input: HolidayCountryForm): Promise<HolidayCountry> {
    const matchedCountry = allCountries.find((c) => c.id === input.id);
    if (!matchedCountry) throw new Error("Invalid country id");

    const currentCountries = await this.getCountries(userId);
    if (currentCountries.some((c) => c.id === matchedCountry.id)) return matchedCountry;

    const updatedCountries = [...currentCountries, matchedCountry];
    await cacheUserHolidayCountries(userId, updatedCountries);

    return matchedCountry;
  },

  /**
   * Add a holiday country by its ISO 2-letter code.
   */
  async addCountryByCode(userId: string, code: string): Promise<HolidayCountry | undefined> {
    const matchedCountry = allCountries.find(
      (c) => c.countryCode.toLowerCase() === code.toLowerCase()
    );
    return matchedCountry ? await this.addCountry(userId, { id: matchedCountry.id }) : undefined;
  },

  /**
   * Remove a holiday country subscription by `countryId`.
   */
  async removeCountry(userId: string, countryId: string): Promise<HolidayCountry> {
    const currentCountries = await this.getCountries(userId);
    const index = currentCountries.findIndex((c) => c.id === countryId);
    if (index === -1) throw new Error("Holiday country not found");

    const [removed] = currentCountries.splice(index, 1);
    await cacheUserHolidayCountries(userId, currentCountries);

    return removed;
  },

  /**
   * Clear all the cached user holiday countries and holidays.
   */
  async clearCache(userId: string): Promise<void> {
    await kv.del(KV_HOLIDAY_COUNTRIES(userId), KV_HOLIDAYS(userId));
  }
};
