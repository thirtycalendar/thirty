import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_BIRTHDAYS } from "$lib/shared/utils/kv-keys";
import type { Birthday, BirthdayForm } from "$lib/shared/types";

import { db } from "../db";
import { birthdayTable } from "../db/tables/birthday";
import { kv } from "../libs/upstash/kv";
import { createDbService } from "../utils/create-db-service";

export const birthdayService = createDbService<Birthday, BirthdayForm>(db, {
  table: birthdayTable,
  kv: {
    kv: kv,
    kvKeyFn: (userId) => KV_BIRTHDAYS(userId),
    cacheTime: kvCacheTimes.birthday
  }
});
