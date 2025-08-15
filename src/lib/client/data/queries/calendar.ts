import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Calendar } from "$lib/shared/types";

let calendarQuery: ReturnType<typeof createQuery<() => Promise<Calendar[]>>> | null = null;

export function getCalendars() {
  if (!calendarQuery) {
    calendarQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.calendar.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["calendars"]
    });
  }

  return calendarQuery;
}
