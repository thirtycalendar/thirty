import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Birthday } from "$lib/shared/types";

let birthdayQuery: ReturnType<typeof createQuery<() => Promise<Birthday[]>>> | null = null;

export function getBirthdays() {
  if (!birthdayQuery) {
    birthdayQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.birthday.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["birthdays"]
    });
  }

  return birthdayQuery;
}
