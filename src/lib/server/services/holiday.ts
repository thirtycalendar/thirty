import { KV_HOLIDAYS } from "$lib/shared/utils/kv-keys";
import type { Holiday, HolidayForm } from "$lib/shared/types";

import { kv } from "../libs/upstash/kv";

export async function cacheHolidays(userId: string, list: Holiday[]) {
  await kv.set(KV_HOLIDAYS(userId), list, { ex: 43000 });
}

export async function getHolidays(userId: string): Promise<Holiday[]> {
  const cached = await kv.get<Holiday[]>(KV_HOLIDAYS(userId));

  return cached ?? [];
}

export async function addHoliday(userId: string, holiday: HolidayForm): Promise<Holiday> {
  const holidays = await getHolidays(userId);
  holidays.push(holiday);

  await cacheHolidays(userId, holidays);

  return holiday;
}

export async function removeHoliday(userId: string, holiday: HolidayForm): Promise<Holiday> {
  const holidays = await getHolidays(userId);
  const index = holidays.findIndex((h) => h.countryName === holiday.countryName);

  if (index === -1) {
    throw new Error("Holiday not found");
  }

  const [removed] = holidays.splice(index, 1);
  await cacheHolidays(userId, holidays);
  return removed;
}

export async function clearHolidays(userId: string) {
  await kv.del(KV_HOLIDAYS(userId));
}
