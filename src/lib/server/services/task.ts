import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_TASKS } from "$lib/shared/utils/kv-keys";
import type { Task, TaskForm } from "$lib/shared/types";

import { db } from "../db";
import { taskTable } from "../db/tables/task";
import { kv } from "../libs/upstash/kv";
import { createDbService } from "../utils/create-db-service";

export const taskServices = createDbService<Task, TaskForm>(db, {
  table: taskTable,
  kv: {
    kv: kv,
    kvKeyFn: (userId) => KV_TASKS(userId),
    cacheTime: kvCacheTimes.task
  }
});
