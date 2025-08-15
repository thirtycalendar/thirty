import { createQuery } from "$lib/client/utils/query/create-query";
import { client } from "$lib/client/utils/rpc";

import type { Holiday, HolidayCountry } from "$lib/shared/types";

let userHolidaysQuery: ReturnType<typeof createQuery<Holiday[]>> | null = null;

export function getHolidays() {
  if (!userHolidaysQuery) {
    userHolidaysQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["holidays"]
    });
  }

  return userHolidaysQuery;
}

let userHolidayCountriesQuery: ReturnType<typeof createQuery<HolidayCountry[]>> | null = null;

export function getHolidayCountries() {
  if (!userHolidayCountriesQuery) {
    userHolidayCountriesQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.country.getAll.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["holiday-countries"]
    });
  }

  return userHolidayCountriesQuery;
}

let allHolidayCountriesQuery: ReturnType<typeof createQuery<HolidayCountry[]>> | null = null;

export function getAllHolidayCountries() {
  if (!allHolidayCountriesQuery) {
    allHolidayCountriesQuery = createQuery({
      queryFn: async () => {
        const res = await client.api.holiday.country.list.$get();
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        return data.data;
      },
      queryKeys: ["all-holiday-countries"]
    });
  }

  return allHolidayCountriesQuery;
}
