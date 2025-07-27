import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Chat } from "$lib/shared/types";

let queryInstance: ReturnType<typeof createQuery<() => Promise<Chat[]>>> | null = null;

export function getChats() {
  if (!queryInstance) {
    queryInstance = createQuery({
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

  return queryInstance;
}
