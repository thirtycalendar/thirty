import { getCalendar, updateCalendar } from "$lib/server/services/calendar";
import { kv } from "$lib/server/libs/upstash/kv";

import { KV_INIT_CALENDAR_STATE } from "$lib/shared/utils/kv-keys";
import type {
  Calendar,
  CalendarForm,
  InitCalendarStateForm,
  InitCalendarStateKV
} from "$lib/shared/types";

export async function storeInitCalendarStateToKV(userId: string, calendarId: string) {
  const initCalendar: InitCalendarStateKV = {
    calendarId,
    isUpdatedTimezone: false
  };

  await kv.set(KV_INIT_CALENDAR_STATE(userId), initCalendar);
}

export async function storeUpdatedInitCalendarStateToKV(userId: string, calendarId: string) {
  const initCalendar: InitCalendarStateKV = {
    calendarId,
    isUpdatedTimezone: true
  };

  await kv.set(KV_INIT_CALENDAR_STATE(userId), initCalendar);
}

export async function updateInitCalendarTimezone(
  userId: string,
  data: InitCalendarStateForm
): Promise<Calendar> {
  const cachedInitCalendar = await kv.get<InitCalendarStateKV>(KV_INIT_CALENDAR_STATE(userId));
  if (!cachedInitCalendar) throw new Error("No cached init calendar");

  if (cachedInitCalendar.isUpdatedTimezone) {
    return await getCalendar(cachedInitCalendar.calendarId);
  }

  const updates: Partial<CalendarForm> = { timezone: data.timezone };

  const updated = await updateCalendar(cachedInitCalendar.calendarId, updates);

  await storeUpdatedInitCalendarStateToKV(userId, cachedInitCalendar.calendarId);

  return updated;
}
