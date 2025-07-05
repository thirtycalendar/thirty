import { kv } from "$lib/server/libs/upstash/kv";

import type { InitCalendar } from "$lib/types/server";
import { KV_INIT_CALENDAR } from "$lib/utils/kv-keys";

export async function initCalendarToKV(userId: string, calendarId: string) {
  const initCalendar: InitCalendar = {
    calendarId,
    isUpdatedTimezone: false
  };

  await kv.set(KV_INIT_CALENDAR(userId), initCalendar);
}
