import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export function eventsQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.event.getAll.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["events"]
  });
}
