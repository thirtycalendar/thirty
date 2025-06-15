import type { auth } from "$lib/server/auth";

import type { Source } from "./server";

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
  source: string;

  title: string;
  colorId: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  status: string;
  recurrence: string[] | null;

  notificationSent: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EventForm {
  calendarId: string;

  title: string;
  colorId: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
}

export interface Task {
  id: string;
  userId: string;
  externalId: string | null;
  source: string;

  title: string;
  notes: string;
  colorId: string;
  due: string;
  status: string;

  notificationSent: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TaskForm {
  title: string;
  notes: string;
  colorId: string;
  due: string;
  status: string;
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
