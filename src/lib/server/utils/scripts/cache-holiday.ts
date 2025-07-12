// Finished index (0, 1, 2, 3, 4): 0
// Last time cached: Sat Jul 12, 2025

// npx tsx ./src/lib/server/utils/scripts/cache-holiday.ts

// If I pay $12 a month for Calendarific, I get 10K
// I can fetch all the country holidays exactly from 2020 to 2055

const index = 0;

fetch(`http://localhost:5173/api/calendarific/cache/${index}`);
