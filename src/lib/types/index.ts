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

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? Record<string, never> : { data: T });

export type ErrorResponse = {
  success: false;
  message: string;
  isFormError?: boolean;
};
