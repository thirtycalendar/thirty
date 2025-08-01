import { CALENDARIFIC_API_KEY } from "$env/static/private";

import { allHolidayCountryVectorClient } from "$lib/server/services/holiday";
import { kvHoliday } from "$lib/server/libs/upstash/kv";

import { KV_ALL_HOLIDAY_COUNTRIES, KV_COUNTRY_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry } from "$lib/shared/types";

import { countries } from "./countries";

const API_KEY = CALENDARIFIC_API_KEY;

const currentYear = new Date().getFullYear();
// Generate years: past 3 (inclusive) and next 5 (inclusive)
const years = Array.from({ length: 9 }, (_, i) => currentYear - 3 + i);

type CalendarificHoliday = {
  name: string;
  description: string;
  country: {
    id: string;
    countryName: string;
  };
  date: {
    iso: string;
  };
};

type CalendarificResponse = {
  response: {
    holidays: CalendarificHoliday[];
  };
};

async function fetchHolidaysForCountryYear(countryCode: string, year: number): Promise<Holiday[]> {
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${year}&type=national`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${countryCode} for ${year}: ${res.status}`);
      return [];
    }

    const json = (await res.json()) as CalendarificResponse;
    if (!json?.response?.holidays?.length) return [];

    return json.response.holidays.map((h) => ({
      id: crypto.randomUUID(),
      name: h.name,
      description: h.description,
      countryId: h.country.id.toLowerCase(),
      countryName: h.country.countryName,
      countryCode: h.country.id,
      date: h.date.iso
    }));
  } catch (err) {
    console.error(`Fetch error for ${countryCode} in ${year}:`, err);
    return [];
  }
}

export async function cacheHolidaysToKV() {
  const cachedCountries = (await kvHoliday.get<HolidayCountry[]>(KV_ALL_HOLIDAY_COUNTRIES)) ?? [];

  for (const country of countries) {
    const { id: countryId, countryCode, countryName } = country;

    if (cachedCountries.some((c) => c.countryCode === countryCode)) {
      console.log(`Skipped ${countryName} (${countryCode}), already cached`);
      continue;
    }

    console.log(`Fetching ${countryName} (${countryCode})`);
    const allHolidays: Holiday[] = [];

    for (const year of years) {
      const holidays = await fetchHolidaysForCountryYear(countryCode, year);
      allHolidays.push(...holidays);

      console.log(`${countryCode} - ${year}: ${holidays.length} holidays`);
      await new Promise((r) => setTimeout(r, 500));
    }

    // Skip caching if no holidays found for any year
    if (allHolidays.length === 0) {
      console.warn(
        `⚠️ No holidays found for ${countryName} (${countryCode}), skipping KV and vector.`
      );
      continue;
    }

    // Cache holidays by country
    await kvHoliday.set(KV_COUNTRY_HOLIDAYS(countryId), allHolidays);
    console.log(`Cached ${allHolidays.length} holidays for ${countryCode}`);

    const newCountry: HolidayCountry = {
      id: country.id,
      color: country.color,
      countryName,
      countryCode
    };

    cachedCountries.push(newCountry);
    await kvHoliday.set(KV_ALL_HOLIDAY_COUNTRIES, cachedCountries);

    await allHolidayCountryVectorClient.upsert(newCountry);
    console.log(`Upserted ${countryName} (${countryCode}) to country vector index`);

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("✅ Caching all the holidays completed.");
}
