import OpenAI from "openai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";
import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_BIRTHDAYS } from "$lib/shared/utils/kv-keys";
import type { Birthday, BirthdayForm } from "$lib/shared/types";

import { db } from "../db";
import { birthdayTable } from "../db/tables/birthday";
import { kv } from "../libs/upstash/kv";
import { vector } from "../libs/upstash/vector";
import { createDbService } from "../utils/create-db-service";

export const birthdayService = createDbService<Birthday, BirthdayForm>(db, {
  table: birthdayTable,
  kv: {
    kv,
    kvKeyFn: (userId) => KV_BIRTHDAYS(userId),
    cacheTime: kvCacheTimes.birthday
  },
  vector: {
    vector,
    openai: new OpenAI({ apiKey: openAiEnvConfig.apiKey }),
    textFn: (e) => {
      return Object.values(e)
        .filter((value) => value !== null && typeof value !== "undefined")
        .map((value) => String(value))
        .join(" ");
    }
  }
});
