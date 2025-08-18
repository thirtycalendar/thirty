import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export const userHolidaysQuery = createQuery({
  queryFn: async () => {
    const res = await client.api.holiday.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["holidays"]
});

export const userHolidayCountriesQuery = createQuery({
  queryFn: async () => {
    const res = await client.api.holiday.country.getAll.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["holiday-countries"]
});

export const allHolidayCountriesQuery = createQuery({
  queryFn: async () => {
    const res = await client.api.holiday.country.list.$get();
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
  queryKeys: ["all-holiday-countries"]
});
