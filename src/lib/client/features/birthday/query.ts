import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Birthday } from "$lib/shared/types";

let queryInstance: ReturnType<typeof createQuery<() => Promise<Birthday[]>>> | null = null;

// Use ({fun1, fun2}) instead of (fun1, fun2)
export function getBirthdays() {
  if (!queryInstance) {
    queryInstance = createQuery({
      queryFn: async () => {
        const res = await client.api.birthday.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["bd-list"]
    });
  }

  return queryInstance;
}
