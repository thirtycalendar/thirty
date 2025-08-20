import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

export function userHolidaysQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.holiday.getAll.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["holidays"]
  });
}

export function userHolidayCountriesQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.holiday.country.getAll.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["holiday-countries"]
  });
}

export function allHolidayCountriesQuery() {
  return createQuery({
    queryFn: async function () {
      const res = await client.api.holiday.country.list.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["all-holiday-countries"]
  });
}
