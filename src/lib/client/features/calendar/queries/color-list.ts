import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

const { data, isPending } = createQuery({
  queryFn: async () => {
    const res = await client.api.google.color.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["color-list"]
});

export { data as colorList, isPending as isColorListPending };
