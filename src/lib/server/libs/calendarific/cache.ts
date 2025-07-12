import { CALENDARIFIC_API_KEY } from "$env/static/private";

import { kv } from "$lib/server/libs/upstash/kv";

import { KV_COUNTRY_HOLIDAYS, KV_HOLIDAY_COUNTRIES } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry } from "$lib/shared/types";

import { countries } from "./countries";

const API_KEY = CALENDARIFIC_API_KEY;
const years = Array.from({ length: 11 }, (_, i) => 2022 + i);

export async function getHolidayCountries(): Promise<HolidayCountry[]> {
  return (await kv.get<HolidayCountry[]>(KV_HOLIDAY_COUNTRIES)) ?? [];
}

export async function getCountryHolidays(countryCode: string): Promise<Holiday[]> {
  const holidays = await kv.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(countryCode));
  return holidays ?? [];
}

async function fetchHolidaysForCountryYear(countryCode: string, year: number): Promise<Holiday[]> {
  const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${year}&type=national`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json?.response?.holidays) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return json.response.holidays.map((h: any) => ({
    name: h.countryName,
    description: h.description,
    country: h.country?.countryName,
    countryCode: h.country?.id,
    date: h.date.iso
  }));
}

export async function cacheHolidaysToKV(batchIndex: number) {
  const batch = countries[batchIndex];
  if (!batch) {
    console.error("Invalid batch index");
    return;
  }

  const cachedCountries = (await kv.get<HolidayCountry[]>(KV_HOLIDAY_COUNTRIES)) ?? [];

  for (const country of batch) {
    if (cachedCountries.some((c) => c.countryCode === country.countryCode)) {
      console.log(
        `Skipped ${country.countryName} (${country.countryCode}), already in cached countries list`
      );
      continue;
    }

    console.log(`Fetching ${country.countryName} (${country.countryCode})`);
    const allHolidays: Holiday[] = [];

    for (const year of years) {
      const holidays = await fetchHolidaysForCountryYear(country.countryCode, year);

      allHolidays.push(...holidays);
      console.log(`Fetched ${holidays.length} holidays for ${country.countryCode} in ${year}`);

      await new Promise((r) => setTimeout(r, 500));
    }

    // Cache holidays to KV
    await kv.set(KV_COUNTRY_HOLIDAYS(country.countryCode), allHolidays);
    console.log(`Cached ${allHolidays.length} holidays for ${country.countryCode}`);

    // Add country to cachedCountries list & update KV
    cachedCountries.push({ countryCode: country.countryCode, countryName: country.countryName });
    await kv.set(KV_HOLIDAY_COUNTRIES, cachedCountries);

    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`Batch ${batchIndex} completed.`);
}
