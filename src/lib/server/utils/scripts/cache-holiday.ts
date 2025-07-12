// Finished index (0, 1, 2, 3, 4): 0
// Last time cached: Sat Jul 12, 2025

// npx tsx ./src/lib/server/utils/scripts/cache-holiday.ts

import { cacheHolidaysToKV } from "$lib/server/libs/calendarific/cache";

const index = 0;

cacheHolidaysToKV(index);
