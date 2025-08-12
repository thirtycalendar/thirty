import { and, eq, sql } from "drizzle-orm";

import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_CALENDARS } from "$lib/shared/utils/kv-keys";
import type { Calendar, CalendarForm } from "$lib/shared/types";

import { db } from "../db";
import { calendarTable } from "../db/tables/calendar";
import { kv } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/create-db-service";
import { voyageAiEnvConfig } from "../utils/env-config";
import { eventService } from "./event";

export const calendarService = createDbService<Calendar, CalendarForm>(db, {
  table: calendarTable,
  kv: {
    kv,
    kvKeyFn: (userId) => KV_CALENDARS(userId),
    cacheTime: kvCacheTimes.calendar
  },
  vector: {
    namespace: "calendars",
    voyageApiKey: voyageAiEnvConfig.apiKey,
    vector
  },
  hooks: {
    create: {
      before: async ({ input, context }) => {
        if (input.isPrimary) await resetPrimaryCalendar(context.userId);
      }
    },
    update: {
      before: async ({ input, context }) => {
        if (input.isPrimary) await resetPrimaryCalendar(context.userId);
      }
    },
    delete: {
      before: async ({ context }) => {
        await eventService.clearCache(context.userId);
      }
    },
    deleteAll: {
      before: async ({ context }) => {
        await eventService.clearCache(context.userId);
      }
    }
  }
});

async function resetPrimaryCalendar(userId: string) {
  await kv.del(KV_CALENDARS(userId));
  await db
    .update(calendarTable)
    .set({ isPrimary: false, updatedAt: sql`now()` })
    .where(and(eq(calendarTable.userId, userId), eq(calendarTable.isPrimary, true)));
}
