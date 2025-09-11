import type { UIMessage } from "ai";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { z } from "zod";

import type { auth } from "$lib/server/auth";
import type {
  birthdayTable,
  calendarTable,
  chatTable,
  creditTable,
  eventTable,
  messageTable,
  taskTable
} from "$lib/server/db/tables";

import type * as Const from "$lib/shared/constants";

import type {
  birthdaySchema,
  calendarSchema,
  chatSchema,
  eventSchema,
  holidayCountrySchema,
  taskSchema,
  waitingListSchema
} from "./schemas";

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
export type HolidayCountryForm = z.infer<typeof holidayCountrySchema>;

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

// Waiting List
export type WaitingListForm = z.infer<typeof waitingListSchema>;

// Enums and Constants
export type SubscriptionPlan = (typeof Const.SubscriptionPlans)[number];
export type Theme = (typeof Const.Themes)[number];
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

// Utils
export type LegalSection = {
  title: string;
  content: (
    | string
    | { type: "pre"; text: string }
    | { type: "link"; href: string; text: string }
    | { type: "list"; items: string[] }
  )[];
};
