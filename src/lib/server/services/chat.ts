import { kvCacheTimes } from "$lib/shared/utils/kv-cache-times";
import { KV_CHATS } from "$lib/shared/utils/kv-keys";
import type { Chat, ChatForm } from "$lib/shared/types";

import { db } from "../db";
import { chatTable } from "../db/tables/chat";
import { kv } from "../libs/upstash/kv";
import { createDbService } from "../utils/create-db-service";

export const chatService = createDbService<Chat, ChatForm>(db, {
  table: chatTable,
  kv: {
    kv,
    kvKeyFn: (userId) => KV_CHATS(userId),
    cacheTime: kvCacheTimes.chat
  }
});
