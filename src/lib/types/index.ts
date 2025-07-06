import type { auth } from "$lib/server/auth";

import type * as Const from "$lib/shared/constants";

export interface Color {
  id: string;
  colorHexCode: string;
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
  id?: string;
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
  timezone: string;
  allDay: boolean;
  status: EventStatus;
  recurrence: string[] | null;

  notifyInMin: number;
  notificationSent: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EventDataType {
  calendarId: string;
  colorId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
}

export interface EventForm {
  id?: string;
  calendarId: string;
  externalId: string | null;
  source: Source;

  name: string;
  colorId: string;
  description: string | null;
  location: string | null;
  start: string;
  end: string;
  timezone: string;
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
  id?: string;
  externalId: string | null;
  source: Source;

  name: string;
  notes: string | null;
  colorId: string;
  due: string;
  status: TaskStatus;
}

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
