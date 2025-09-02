import type { Birthday, BirthdayForm } from "$lib/shared/types";

import { db } from "../db";
import { birthdayTable } from "../db/tables";
import { kv, kvCacheTimes } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/db-service";
import { voyageAiEnvConfig } from "../utils/env-config";
import { KV_BIRTHDAYS } from "../utils/kv-keys";

export const birthdayService = createDbService<Birthday, BirthdayForm>(db, {
  table: birthdayTable,
  kv: {
    kv,
    kvKeyFn: (userId) => KV_BIRTHDAYS(userId),
    cacheTime: kvCacheTimes.birthday
  },
  vector: {
    namespace: "birthdays",
    voyageApiKey: voyageAiEnvConfig.apiKey,
    vector
  }
});
