import { and, eq, sql } from "drizzle-orm";

import type { Calendar, CalendarForm } from "$lib/shared/types";

import { db } from "../db";
import { calendarTable } from "../db/tables";
import { kv, kvCacheTimes } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/db-service";
import { voyageAiEnvConfig } from "../utils/env-config";
import { KV_CALENDARS } from "../utils/kv-keys";

import { eventService } from ".";

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
