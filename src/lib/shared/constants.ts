export const Source = ["local", "file", "google", "outlook", "apple"] as const;

export const EventStatus = ["confirmed", "cancelled", "tentative"] as const;

export const EventAttendeeStatus = ["accepted", "declined", "tentative", "needsAction"] as const;

export const TaskStatus = ["pending", "completed"] as const;

export const NotifyInMin = [0, 5, 10, 15, 30, 60] as const;
