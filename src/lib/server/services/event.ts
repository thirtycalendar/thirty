import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_EVENTS } from "$lib/shared/utils/kv-keys";
import type { Event, EventForm } from "$lib/shared/types";

import { db } from "../db";
import { eventTable } from "../db/tables/event";
import { kv } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/create-db-service";
import { voyageAiEnvConfig } from "../utils/env-config";

export const eventService = createDbService<Event, EventForm>(db, {
  table: eventTable,
  kv: {
    kv,
    kvKeyFn: (userId) => KV_EVENTS(userId),
    cacheTime: kvCacheTimes.event
  },
  vector: {
    namespace: "events",
    voyageApiKey: voyageAiEnvConfig.apiKey,
    vector
  }
});
