import type { UIMessage } from "ai";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { z } from "zod";

import type { auth } from "$lib/server/auth";
import type { birthdayTable } from "$lib/server/db/tables/birthday";
import type { calendarTable } from "$lib/server/db/tables/calendar";
import type { chatTable } from "$lib/server/db/tables/chat";
import type { creditTable } from "$lib/server/db/tables/credit";
import type { eventTable } from "$lib/server/db/tables/event";
import type { messageTable } from "$lib/server/db/tables/message";
import type { taskTable } from "$lib/server/db/tables/task";

import type * as Const from "$lib/shared/constants";

import type { birthdaySchema } from "./schemas/birthday";
import type { calendarSchema } from "./schemas/calendar";
import type { chatSchema } from "./schemas/chat";
import type { eventSchema } from "./schemas/event";
import type { hdCountrySchema } from "./schemas/holiday";
import type { taskSchema } from "./schemas/task";

// Calendar
export type CalendarView = (typeof Const.CalendarViews)[number];

export type Calendar = InferSelectModel<typeof calendarTable>;
export type CalendarForm = z.infer<typeof calendarSchema>;

// Events
export type Event = InferSelectModel<typeof eventTable>;
export type EventForm = z.infer<typeof eventSchema>;

export interface EventChunk {
  event: Event;
  start: Date;
  end: Date;
  day?: Date;
}

export interface AllDayLayoutInfo extends Event {
  startColumn: number;
  span: number;
  lane: number;
}

//  Tasks
export type Task = InferSelectModel<typeof taskTable>;
export type TaskForm = z.infer<typeof taskSchema>;

// Birthdays
export type Birthday = InferSelectModel<typeof birthdayTable>;
export type BirthdayForm = z.infer<typeof birthdaySchema>;

//  Holidays
export interface HolidayCountry {
  id: string;
  countryName: string;
  countryCode: string;
  color: Color;
}
export type HolidayCountryForm = z.infer<typeof hdCountrySchema>;

export interface Holiday {
  id: string;
  name: string;
  description: string;
  countryId: string;
  countryName: string;
  countryCode: string;
  date: string;
}

// Chat
export type Chat = InferSelectModel<typeof chatTable>;
export type ChatForm = InferInsertModel<typeof chatTable>;
export type ChatUpdateForm = z.infer<typeof chatSchema>;

// Messages
export type Message = InferSelectModel<typeof messageTable>;
export type MessageForm = InferInsertModel<typeof messageTable>;

export type MessageRole = UIMessage["role"];

// Credit
export type Credit = InferSelectModel<typeof creditTable>;
export type CreditForm = InferInsertModel<typeof creditTable>;

// Enums and Constants
export type SubscriptionPlan = (typeof Const.SubscriptionPlans)[number];
export type Color = (typeof Const.Colors)[number];
export type Source = (typeof Const.Sources)[number];
export type EventStatus = (typeof Const.EventStatuses)[number];
export type EventAttendeeStatus = (typeof Const.AttendeeStatuses)[number];
export type TaskStatus = (typeof Const.TaskStatuses)[number];
export type NotifyInMin = (typeof Const.NotificationMinutes)[number];
export type NotifyInDay = (typeof Const.NotificationDays)[number];

// KV
export interface IpLocationKV {
  countryName: string;
  countryCode: string;
  timezone: string;
}

export interface GoogleSessionKV {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
}

// Auth
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

// API Responses
export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? Record<string, never> : { data: T });

export interface ErrorResponse {
  success: false;
  message: string;
  isFormError?: boolean;
}
