import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

const { data, isPending } = createQuery({
  queryFn: async () => {
    const res = await client.api.google.calendar.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["cal-list"]
});

export { data as calendarList, isPending as isCalendarListPending };
