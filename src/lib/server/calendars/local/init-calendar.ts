import { kv } from "$lib/server/libs/upstash/kv";

import { KV_INIT_CALENDAR } from "$lib/shared/utils/kv-keys";
import type { InitCalendar } from "$lib/shared/types";

export async function initCalendarToKV(userId: string, calendarId: string) {
  const initCalendar: InitCalendar = {
    calendarId,
    isUpdatedTimezone: false
  };

  await kv.set(KV_INIT_CALENDAR(userId), initCalendar);
}
