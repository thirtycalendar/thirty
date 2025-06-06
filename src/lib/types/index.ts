import type { auth } from "$lib/server/auth";

export interface Calendar {
  id: string;
  summary: string;
  timeZone: string;
  backgroundColor: string;
  accessRole: string;
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
