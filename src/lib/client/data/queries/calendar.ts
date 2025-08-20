import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export function calendarsQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.calendar.getAll.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["calendars"]
  });
}

export function getCalendar(calendarId: string) {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.calendar.get[":id"].$get({
        param: { id: calendarId }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["calendar", calendarId]
  });
}
