import type { SubscriptionPlan } from "./types";

export const SubscriptionPlans = ["pro", "free"] as const;

export const MessageLimitByPlan: Record<SubscriptionPlan, number> = {
  pro: 2000,
  free: 10
};

export const Themes = ["light", "dark"] as const;

export const CalendarViews = ["year", "month", "week", "day"] as const;

export const Sources = ["local", "file", "google", "outlook", "apple"] as const;

export const EventStatuses = ["confirmed", "cancelled", "tentative"] as const;

export const AttendeeStatuses = ["accepted", "declined", "tentative", "needsAction"] as const;

export const TaskStatuses = ["pending", "completed"] as const;

export const NotificationMinutes = [0, 5, 10, 15, 30, 60] as const;

export const NotificationDays = [1, 7, 10, 15, 30] as const;

export const Colors = [
  "#ac725e",
  "#d06b64",
  "#f83a22",
  "#fa573c",
  "#ff7537",
  "#ffad46",
  "#42d692",
  "#16a765",
  "#7bd148",
  "#b3dc6c",
  "#fbe983",
  "#fad165",
  "#92e1c0",
  "#9fe1e7",
  "#9fc6e7",
  "#4986e7",
  "#9a9cff",
  "#b99aff",
  "#c2c2c2",
  "#cabdbf",
  "#cca6ac",
  "#f691b2",
  "#cd74e6",
  "#a47ae2"
] as const;

export const MAX_INPUT_LENGTH = 255 as const;

export const ChatGreetings = [
  "How can I help?",
  "What's on your calendar?",
  "Need to schedule something?",
  "Got an event in mind?",
  "Add a new meeting?",
  "Any birthdays coming up?",
  "Should I remind you?",
  "Planning holidays soon?",
  "What's your next task?",
  "Check upcoming events?",
  "Set a reminder?",
  "Whose birthday is it?",
  "Organize your week?",
  "Block focus time?",
  "Review your calendar?",
  "Plan some time off?",
  "Create an event?",
  "Reschedule something?",
  "Clear your calendar?",
  "Next important date?",
  "Track deadlines?",
  "Today's agenda?",
  "Find free time?",
  "Weekly overview?",
  "Prepare for events?",
  "Remind about holidays?",
  "Celebrate something?",
  "Log a birthday idea?",
  "Sync your calendars?",
  "Keep plans tidy?"
] as const;
