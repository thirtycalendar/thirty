import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export const birthdaysQuery = createQuery({
  queryFn: async () => {
    const res = await client.api.birthday.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["birthdays"]
});
