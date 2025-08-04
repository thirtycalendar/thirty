import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Chat, Message } from "$lib/shared/types";

let chatQuery: ReturnType<typeof createQuery<() => Promise<Chat[]>>> | null = null;

export function getChats() {
  if (!chatQuery) {
    chatQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.chat.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["chat-list"],
      staleTime: Number.POSITIVE_INFINITY
    });
  }

  return chatQuery;
}

let messageQuery: ReturnType<typeof createQuery<() => Promise<Message[]>>> | null = null;

export function getMessages(chatId: string) {
  messageQuery = createQuery({
    enabled: !!chatId,
    queryFn: async () => {
      const res = await client.api.chat.message.getAll[":chatId"].$get({ param: { chatId } });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.data.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt)
      }));
    },
    queryKeys: ["message-list", chatId]
    // staleTime: Number.POSITIVE_INFINITY
  });

  return messageQuery;
}
