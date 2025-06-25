import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

// Use ({fun1, fun2}) instead of (fun1, fun2)
export function getEvents() {
  return createQuery({
    queryFn: async () => {
      const res = await client.api.event.getAll.$get();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.data;
    },
    queryKeys: ["event-list"]
  });
}
