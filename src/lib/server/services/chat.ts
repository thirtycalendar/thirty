import type { Chat, ChatForm } from "$lib/shared/types";

import { db } from "../db";
import { chatTable } from "../db/tables/chat";
import { createDbService } from "../utils/create-db-service";

export const chatService = createDbService<Chat, ChatForm>(db, {
  table: chatTable
});
