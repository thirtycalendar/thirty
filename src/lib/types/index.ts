import type { auth } from "$lib/server/auth";

export interface Calendar {
  id: string;
  summary: string;
  timeZone: string;
  backgroundColor: string;
  accessRole: "owner" | "reader";
}

export interface Event {
  id: string;
  summary: string;
  description?: string | null;
  colorId?: string | null;
  organizer?: {
    displayName: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  reminders:
    | {
        useDefault?: boolean;
        overrides?: Array<{ minutes?: number | null }>;
      }
    | undefined;
  eventType: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  updated: string;
}

export interface EventForm {
  name: string;
  calendar: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  location?: string;
  description?: string;
  notifyIn?: string;
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
