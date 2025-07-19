import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_EVENTS } from "$lib/shared/utils/kv-keys";
import type { Event, EventForm } from "$lib/shared/types";

import { db } from "../db";
import { eventTable } from "../db/tables/event";
import { kv } from "../libs/upstash/kv";
import { createDbService } from "../utils/create-db-service";

export const eventServices = createDbService<Event, EventForm>(db, {
  table: eventTable,
  kv: {
    kv: kv,
    kvKeyFn: (userId) => KV_EVENTS(userId),
    cacheTime: kvCacheTimes.event
  }
});

export async function createEventsBulk(userId: string, data: EventForm[]) {
  if (data.length === 0) return;
  await db.insert(eventTable).values(data.map((e) => ({ ...e, userId })));
}
