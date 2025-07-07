import type { InferSelectModel } from "drizzle-orm";
import type { z } from "zod";

import type { auth } from "$lib/server/auth";
import type { calendarTable } from "$lib/server/db/tables/calendar";
import type { eventTable } from "$lib/server/db/tables/event";
import type { taskTable } from "$lib/server/db/tables/task";

import type * as Const from "$lib/shared/constants";

import type { calendarSchema } from "./schemas/calendar";
import type { eventSchema } from "./schemas/event";
import type { holidaySchema } from "./schemas/holiday";
import type { taskSchema } from "./schemas/task";

export interface Color {
  id: string;
  colorHexCode: string;
}

export type Calendar = InferSelectModel<typeof calendarTable>;
export type CalendarForm = z.infer<typeof calendarSchema>;

export interface InitCalendarStateKV {
  calendarId: string;
  isUpdatedTimezone: boolean;
}

export type Event = InferSelectModel<typeof eventTable>;

export interface EventDataType {
  calendarId: string;
  colorId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
}

export type EventForm = z.infer<typeof eventSchema>;

export type Task = InferSelectModel<typeof taskTable>;
export type TaskForm = z.infer<typeof taskSchema>;

export type Holiday = z.infer<typeof holidaySchema>;
export type HolidayForm = z.infer<typeof holidaySchema>;

export type Source = (typeof Const.Source)[number];

export type EventStatus = (typeof Const.EventStatus)[number];

export type EventAttendeeStatus = (typeof Const.EventAttendeeStatus)[number];

export type TaskStatus = (typeof Const.TaskStatus)[number];

export type NotifyInMin = (typeof Const.NotifyInMin)[number];

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? Record<string, never> : { data: T });

export type ErrorResponse = {
  success: false;
  message: string;
  isFormError?: boolean;
};

export interface GoogleSessionKV {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
}
