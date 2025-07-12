import { KV_COUNTRY_HOLIDAYS, KV_USER_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, UserHoliday, UserHolidayForm } from "$lib/shared/types";

import { kv } from "../libs/upstash/kv";

export async function cacheHolidayCountries(userId: string, list: UserHoliday[]) {
  await kv.set(KV_USER_HOLIDAYS(userId), list);
}

export async function getHolidays(userId: string): Promise<Holiday[]> {
  const selectedCountries = (await kv.get<UserHoliday[]>(KV_USER_HOLIDAYS(userId))) || [];
  const allHolidays: Holiday[] = [];

  for (const country of selectedCountries) {
    const countryHolidays = await kv.get<Holiday[]>(KV_COUNTRY_HOLIDAYS(country.countryCode));
    if (countryHolidays) {
      allHolidays.push(...countryHolidays);
    }
  }

  return allHolidays;
}

export async function getUserHolidayCountries(userId: string): Promise<UserHoliday[]> {
  const cached = await kv.get<UserHoliday[]>(KV_USER_HOLIDAYS(userId));

  return cached ?? [];
}

export async function addUserHolidayCountry(
  userId: string,
  holiday: UserHolidayForm
): Promise<UserHoliday> {
  const holidays = await getUserHolidayCountries(userId);
  const exists = holidays.some((h) => h.countryCode === holiday.countryCode);

  if (exists) {
    return holiday;
  }

  holidays.push(holiday);
  await cacheHolidayCountries(userId, holidays);

  return holiday;
}

export async function removeUserHolidayCountry(
  userId: string,
  holiday: UserHolidayForm
): Promise<UserHoliday> {
  const holidays = await getHolidays(userId);
  const index = holidays.findIndex((h) => h.countryCode === holiday.countryCode);

  if (index === -1) {
    throw new Error("UserHoliday not found");
  }

  const [removed] = holidays.splice(index, 1);
  await cacheHolidayCountries(userId, holidays);
  return removed;
}

export async function clearUserHolidayCountries(userId: string) {
  await kv.del(KV_USER_HOLIDAYS(userId));
}
