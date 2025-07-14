import {
  KV_COUNTRY_HOLIDAYS,
  KV_USER_HOLIDAY_COUNTRIES,
  KV_USER_HOLIDAYS
} from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayCountry, HolidayCountryForm } from "$lib/shared/types";

import { countries } from "../libs/calendarific/countries";
import { kv, kvHoliday } from "../libs/upstash/kv";

export async function cacheUserHolidayCountries(userId: string, list: HolidayCountry[]) {
  await kv.set(KV_USER_HOLIDAY_COUNTRIES(userId), list);
}

export async function getUserHolidays(userId: string): Promise<Holiday[]> {
  const selectedCountries = await getUserHolidayCountries(userId);
  const allHolidays: Holiday[] = [];

  for (const country of selectedCountries) {
    const countryHolidays = await kvHoliday.get<Holiday[]>(
      KV_COUNTRY_HOLIDAYS(country.countryCode)
    );
    if (countryHolidays) {
      allHolidays.push(...countryHolidays);
    }
  }

  return allHolidays;
}

export async function getUserHolidayCountries(userId: string): Promise<HolidayCountry[]> {
  const cached = await kv.get<HolidayCountry[]>(KV_USER_HOLIDAY_COUNTRIES(userId));

  return cached ?? [];
}

export async function addUserHolidayCountry(
  userId: string,
  holiday: HolidayCountryForm
): Promise<HolidayCountry> {
  const holidays = await getUserHolidayCountries(userId);
  const exists = holidays.some((h) => h.countryCode === holiday.countryCode);

  if (exists) {
    return holiday;
  }

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

  if (index === -1) {
    throw new Error("Holiday country not found");
  }

  const [removed] = holidays.splice(index, 1);
  await cacheUserHolidayCountries(userId, holidays);
  return removed;
}

export async function clearUserHolidayCountries(userId: string) {
  await kv.del(KV_USER_HOLIDAYS(userId));
}

export async function addUserHolidayCountryByItsCode(userId: string, countryCode: string) {
  const flatCountries = countries.flat();

  const matched = flatCountries.find(
    (c) => c.countryCode.toLocaleLowerCase() === countryCode.toLocaleLowerCase()
  );

  if (matched) {
    const data: HolidayCountryForm = {
      id: matched.id,
      colorId: matched.colorId,
      countryName: matched.countryName,
      countryCode: matched.countryCode
    };

    await addUserHolidayCountry(userId, data);
  }
}
