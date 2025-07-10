import { boolean, date, jsonb, pgTable, text, time, uuid } from "drizzle-orm/pg-core";

import type { EventAttendeeStatus, EventStatus, Source } from "$lib/shared/types";

import { userTable } from "./auth";
import { calendarTable } from "./calendar";
import { notification, timestamps } from "./utils";

export const eventTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  calendarId: uuid("calendar_id")
    .notNull()
    .references(() => calendarTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  colorId: text("color_id").notNull(),
  description: text("description"),
  location: text("location"),

  startDate: date("start_date").notNull(),
  startTime: time("start_time", { precision: 0 }).notNull(),
  endDate: date("end_date").notNull(),
  endTime: time("end_time", { precision: 0 }).notNull(),

  timezone: text("timezone").default("UTC").notNull(),
  allDay: boolean("all_day").default(false).notNull(),
  status: text("status").$type<EventStatus>().default("confirmed").notNull(),
  recurrence: jsonb("recurrence").$type<string[] | null>(),

  ...notification,

  ...timestamps
});

export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),

  email: text("email").notNull(),
  name: text("name"),
  status: text("status").$type<EventAttendeeStatus>().default("needsAction").notNull(),
  isSelf: boolean("is_self").default(false).notNull(),

  notificationSent: boolean("notificationSent").default(false).notNull(),

  ...timestamps
});

export const eventMetadata = pgTable("event_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),

  aiSummary: text("ai_summary"),
  aiTags: jsonb("ai_tags").$type<string[] | null>(),

  ...timestamps
});
