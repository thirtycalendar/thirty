import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Holiday, HolidayCountry } from "$lib/shared/types";

let userHolidaysQuery: ReturnType<typeof createQuery<() => Promise<Holiday[]>>> | null = null;

export function getUserHolidays() {
  if (!userHolidaysQuery) {
    userHolidaysQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["user-holidays"]
    });
  }

  return userHolidaysQuery;
}

let userHolidayCountriesQuery: ReturnType<
  typeof createQuery<() => Promise<HolidayCountry[]>>
> | null = null;

export function getUserHolidayCountries() {
  if (!userHolidayCountriesQuery) {
    userHolidayCountriesQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.country.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["user-holiday-countries"]
    });
  }

  return userHolidayCountriesQuery;
}

let allHolidayCountriesQuery: ReturnType<
  typeof createQuery<() => Promise<HolidayCountry[]>>
> | null = null;

export function getHolidayCountries() {
  if (!allHolidayCountriesQuery) {
    allHolidayCountriesQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.country.list.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      // Note: Changed queryKey for clarity if it's truly "all" vs "user's"
      queryKeys: ["all-holiday-countries"]
    });
  }

  return allHolidayCountriesQuery; // Ensure this returns the correct query
}
