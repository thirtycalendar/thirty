import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export function getMessagesQuery(chatId: string) {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.chat.message.getAll[":chatId"].$get({
        param: { chatId }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["messages", `${chatId}:messages`],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!chatId
  });
}
