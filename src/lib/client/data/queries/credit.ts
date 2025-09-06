import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export function creditsQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.user.credit.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["credits"]
  });
}
