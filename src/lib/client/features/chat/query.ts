import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Chat } from "$lib/shared/types";

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

// let messageQuery: ReturnType<typeof createQuery<() => Promise<Message[]>>> | null = null;

// export function getMessages(chatId: string) {
//   if (!messageQuery) {
//     messageQuery = createQuery({
//       queryFn: async () => {
//         const res = await client.api.message.getAll[":chatId"].$get({ param: { chatId } });
//         const data = await res.json();

//         if (!data.success) throw new Error(data.message);

//         return data.data.map((message) => ({
//           ...message,
//           createdAt: new Date(message.createdAt)
//         }));
//       },
//       queryKeys: ["chat-list"],
//       staleTime: Number.POSITIVE_INFINITY
//     });
//   }

//   return messageQuery;
// }

export function getMessages(chatId: string) {
  const messageQuery = createQuery({
    queryFn: async () => {
      const res = await client.api.message.getAll[":chatId"].$get({ param: { chatId } });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.data.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt)
      }));
    },
    queryKeys: ["message-list"],
    staleTime: Number.POSITIVE_INFINITY
  });

  return messageQuery;
}
