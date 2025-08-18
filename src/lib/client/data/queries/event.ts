import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Event } from "$lib/shared/types";

export const eventsQuery = createQuery<Event[]>({
  queryFn: async () => {
    const res = await client.api.event.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["events"]
});
