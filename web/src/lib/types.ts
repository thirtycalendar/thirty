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
