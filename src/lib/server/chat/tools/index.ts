import { createBirthdayTools } from "./birthday";
import { createCalendarTools } from "./calendar";
import { createEventTools } from "./event";

export function createTools(userId: string) {
  return {
    ...createCalendarTools(userId),
    ...createEventTools(userId),
    ...createBirthdayTools(userId)
  };
}
