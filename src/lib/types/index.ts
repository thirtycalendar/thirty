import type { auth } from "$lib/server/auth";

export interface ColorMap {
  [id: string]: {
    background: string;
    foreground: string;
  };
}

export interface Color {
  calendar: ColorMap;
  event: ColorMap;
}

export interface Calendar {
  id: string;
  userId: string;
  externalId: string | null;
  source: Source;

  name: string;
  colorId: string;
  timezone: string;
  isPrimary: boolean;
  isSynced: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CalendarForm {
  externalId: string | null;
  source: Source;

  name: string;
  colorId: string;
  timezone: string;
  isPrimary: boolean;
}

export interface Event {
  id: string;
  userId: string;
  calendarId: string;
  externalId: string | null;
  source: Source;

  name: string;
  colorId: string;
  description: string | null;
  location: string | null;
  start: string;
  end: string;
  allDay: boolean;
  status: EventStatus;
  recurrence: string[] | null;

  notificationSent: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EventForm {
  calendarId: string;
  externalId: string | null;
  source: Source;

  name: string;
  colorId: string;
  description: string | null;
  location: string | null;
  start: string;
  end: string;
  allDay: boolean;
  status: EventStatus;
}

export interface Task {
  id: string;
  userId: string;
  externalId: string | null;
  source: Source;

  name: string;
  notes: string | null;
  colorId: string;
  due: string;
  status: TaskStatus;

  notificationSent: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TaskForm {
  externalId: string | null;
  source: Source;

  name: string;
  notes: string | null;
  colorId: string;
  due: string;
  status: TaskStatus;
}

export const Source = ["local", "google", "outlook", "apple"] as const;
export type Source = (typeof Source)[number];

export const EventStatus = ["confirmed", "cancelled", "tentative"] as const;
export type EventStatus = (typeof EventStatus)[number];

export const EventAttendeeStatus = ["accepted", "declined", "tentative", "needsAction"] as const;
export type EventAttendeeStatus = (typeof EventAttendeeStatus)[number];

export const TaskStatus = ["pending", "completed"] as const;
export type TaskStatus = (typeof TaskStatus)[number];

export const NotifyInMin = [0, 5, 10, 15, 30, 60] as const;
export type NotifyInMin = (typeof NotifyInMin)[number];

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
