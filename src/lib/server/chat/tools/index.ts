import { createBirthdayTools } from "./birthday";
import { createCalendarTools } from "./calendar";
import { createEventTools } from "./event";
import { createHolidayTools } from "./holiday";

export function createTools(userId: string) {
  return {
    ...createCalendarTools(userId),
    ...createEventTools(userId),
    ...createBirthdayTools(userId),
    ...createHolidayTools(userId)
  };
}
