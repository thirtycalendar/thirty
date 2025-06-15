import type { auth } from "$lib/server/auth";

import type { EventStatus, Source, TaskStatus } from "./server";

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
  source: string | null;

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

  name: string;
  colorId: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  status: EventStatus;
}

export interface Task {
  id: string;
  userId: string;
  externalId: string | null;
  source: string;

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
  name: string;
  notes: string | null;
  colorId: string;
  due: string;
  status: TaskStatus;
}

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
