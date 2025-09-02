import type { Event, EventForm } from "$lib/shared/types";

import { db } from "../db";
import { eventTable } from "../db/tables";
import { kv, kvCacheTimes } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/db-service";
import { voyageAiEnvConfig } from "../utils/env-config";
import { KV_EVENTS } from "../utils/kv-keys";

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
