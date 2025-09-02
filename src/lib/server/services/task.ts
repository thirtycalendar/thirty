import type { Task, TaskForm } from "$lib/shared/types";

import { db } from "../db";
import { taskTable } from "../db/tables";
import { kv, kvCacheTimes } from "../libs/upstash/kv";
import { createDbService } from "../utils/db-service";
import { KV_TASKS } from "../utils/kv-keys";

export const taskService = createDbService<Task, TaskForm>(db, {
  table: taskTable,
  kv: {
    kv: kv,
    kvKeyFn: (userId) => KV_TASKS(userId),
    cacheTime: kvCacheTimes.task
  }
});
