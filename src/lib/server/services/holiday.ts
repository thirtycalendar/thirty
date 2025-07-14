import {
  KV_COUNTRY_HOLIDAYS,
  KV_USER_HOLIDAY_COUNTRIES,
  KV_USER_HOLIDAYS
} from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

import { countries } from "../libs/calendarific/countries";
import { kv, kvHoliday } from "../libs/upstash/kv";

// Holiday returned years
const YEAR = new Date().getFullYear();
const FROM = new Date(YEAR - 1, 0, 1); // From past year
const TO = new Date(YEAR + 3, 11, 31); // To next three years

export async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]) {
  await kv.set(KV_USER_HOLIDAY_COUNTRIES(userId), list);
  await updateUserHolidaysCache(userId, list);
}

export async function getUserHolidayCountries(userId: string): Promise<HolidayCountry[]> {
  return (await kv.get<HolidayCountry[]>(KV_USER_HOLIDAY_COUNTRIES(userId))) ?? [];
}

export async function getUserHolidays(userId: string): Promise<Holiday[]> {
  const cached = await kv.get<Holiday[]>(KV_USER_HOLIDAYS(userId));
  if (cached) return cached;

  const countries = await getUserHolidayCountries(userId);
  return await updateUserHolidaysCache(userId, countries);
}

export async function addUserHolidayCountry(
  userId: string,
  holiday: HolidayCountryForm
): Promise<HolidayCountry> {
  const holidays = await getUserHolidayCountries(userId);
  const exists = holidays.some((h) => h.countryCode === holiday.countryCode);
  if (exists) return holiday;

  holidays.push(holiday);
  await cacheUserHolidayCountries(userId, holidays);

  return holiday;
}

export async function removeUserHolidayCountry(
  userId: string,
  holiday: HolidayCountryForm
): Promise<HolidayCountry> {
  const holidays = await getUserHolidayCountries(userId);
  const index = holidays.findIndex((h) => h.id === holiday.id);

  if (index === -1) throw new Error("Holiday country not found");

  const [removed] = holidays.splice(index, 1);
  await cacheUserHolidayCountries(userId, holidays);
  return removed;
}

export async function clearUserHolidayCountries(userId: string) {
  await kv.del(KV_USER_HOLIDAY_COUNTRIES(userId));
  await kv.del(KV_USER_HOLIDAYS(userId));
}

export async function addUserHolidayCountryByItsCode(userId: string, countryCode: string) {
  const flatCountries = countries.flat();

  const matched = flatCountries.find(
    (c) => c.countryCode.toLowerCase() === countryCode.toLowerCase()
  );

  if (!matched) return;

  const data: HolidayCountryForm = {
    id: matched.id,
    colorId: matched.colorId,
    countryName: matched.countryName,
    countryCode: matched.countryCode
  };

  await addUserHolidayCountry(userId, data);
}

async function updateUserHolidaysCache(
  userId: string,
  countries: HolidayCountry[]
): Promise<Holiday[]> {
  const allHolidays: Holiday[] = [];

  for (const country of countries) {
    const holidays = await kvHoliday.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(country.countryCode));
    if (holidays?.length) {
      allHolidays.push(
        ...holidays.filter((h) => {
          const date = new Date(h.date);
          return date >= FROM && date <= TO;
        })
      );
    }
  }

  await kv.set(KV_USER_HOLIDAYS(userId), allHolidays, { ex: 60 * 60 * 24 });
  return allHolidays;
}
