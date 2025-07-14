import { CALENDARIFIC_API_KEY } from "$env/static/private";

import { kvHoliday } from "$lib/server/libs/upstash/kv";

import { KV_ALL_HOLIDAY_COUNTRIES, KV_COUNTRY_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry } from "$lib/shared/types";

import { countries } from "./countries";

const API_KEY = CALENDARIFIC_API_KEY;
const years = Array.from({ length: 12 }, (_, i) => 2020 + i);

export async function getAllHolidayCountries(): Promise<HolidayCountry[]> {
  return (await kvHoliday.get<HolidayCountry[]>(KV_ALL_HOLIDAY_COUNTRIES)) ?? [];
}

export async function getCountryHolidays(countryCode: string): Promise<Holiday[]> {
  return (await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(countryCode))) ?? [];
}

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
      country: h.country.countryName,
      countryCode: h.country.id,
      date: h.date.iso
    }));
  } catch (err) {
    console.error(`Fetch error for ${countryCode} in ${year}:`, err);
    return [];
  }
}

export async function cacheHolidaysToKV(batchIndex: number) {
  const batch = countries[batchIndex];
  if (!batch) {
    console.error("Invalid batch index");
    return;
  }

  const cachedCountries = (await kvHoliday.get<HolidayCountry[]>(KV_ALL_HOLIDAY_COUNTRIES)) ?? [];

  for (const country of batch) {
    const { countryCode, countryName } = country;

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

    // Cache holidays by country
    await kvHoliday.set(KV_COUNTRY_HOLIDAYS(countryCode), allHolidays);
    console.log(`Cached ${allHolidays.length} holidays for ${countryCode}`);

    // Update cached countries list
    cachedCountries.push({
      id: country.id,
      colorId: country.colorId,
      countryName,
      countryCode
    });
    await kvHoliday.set(KV_ALL_HOLIDAY_COUNTRIES, cachedCountries);

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`Batch ${batchIndex} completed.`);
}
