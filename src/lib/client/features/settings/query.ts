import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Credit } from "$lib/shared/types";

let creditQuery: ReturnType<typeof createQuery<() => Promise<Credit>>> | null = null;

export function getCredit() {
  if (!creditQuery) {
    creditQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.user.credit.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["credit"]
    });
  }

  return creditQuery;
}
