import { KV_COUNTRY_HOLIDAYS, KV_HOLIDAY_COUNTRIES, KV_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

import { countries } from "../libs/calendarific/countries";
import { kv, kvHoliday } from "../libs/upstash/kv";

const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1);
const TO = new Date(YEAR + 3, 11, 31);

export async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]) {
  await kv.set(KV_HOLIDAY_COUNTRIES(userId), list);
  await updateHolidaysCache(userId, list);
}

export async function getHolidayCountries(userId: string): Promise<HolidayCountry[]> {
  return (await kv.get<HolidayCountry[]>(KV_HOLIDAY_COUNTRIES(userId))) ?? [];
}

export async function getHolidays(userId: string): Promise<Holiday[]> {
  const cached = await kv.get<Holiday[]>(KV_HOLIDAYS(userId));
  if (cached) return cached;

  const countries = await getHolidayCountries(userId);
  return await updateHolidaysCache(userId, countries);
}

export async function addHolidayCountry(
  userId: string,
  input: HolidayCountryForm
): Promise<HolidayCountry> {
  const allCountries = countries.flat();
  const matched = allCountries.find((c) => c.id === input.id);
  if (!matched) throw new Error("Invalid country id");

  const current = await getHolidayCountries(userId);
  const exists = current.some((c) => c.id === matched.id);
  if (exists) return matched;

  current.push(matched);
  await cacheUserHolidayCountries(userId, current);
  return matched;
}

export async function removeHolidayCountry(userId: string, id: string): Promise<HolidayCountry> {
  const current = await getHolidayCountries(userId);
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Holiday country not found");

  const [removed] = current.splice(index, 1);
  await cacheUserHolidayCountries(userId, current);
  return removed;
}

export async function clearUserHolidayCountries(userId: string) {
  await kv.del(KV_HOLIDAY_COUNTRIES(userId));
  await kv.del(KV_HOLIDAYS(userId));
}

export async function addUserHolidayCountryByItsCode(userId: string, code: string) {
  const flatCountries = countries.flat();
  const matched = flatCountries.find((c) => c.countryCode.toLowerCase() === code.toLowerCase());
  if (!matched) return;

  await addHolidayCountry(userId, { id: matched.id });
}

async function updateHolidaysCache(
  userId: string,
  countries: HolidayCountry[]
): Promise<Holiday[]> {
  const all: Holiday[] = [];

  for (const country of countries) {
    const list = await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(country.id));
    if (!list?.length) continue;

    const filtered = list.filter((h) => {
      const date = new Date(h.date);
      return date >= FROM && date <= TO;
    });

    all.push(...filtered);
  }

  await kv.set(KV_HOLIDAYS(userId), all, { ex: 60 * 60 * 24 });
  return all;
}
