import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Color, EventAttendeeStatus, EventStatus, Source } from "$lib/shared/types";

import { notification, timestamps } from "./utils";

import { calendarTable, userTable } from ".";

export const eventTable = sqliteTable("events", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  calendarId: text("calendar_id")
    .notNull()
    .references(() => calendarTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  color: text("color").$type<Color>().default("#4986e7").notNull(),
  description: text("description"),
  location: text("location"),

  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),

  timezone: text("timezone").default("UTC").notNull(),
  allDay: integer("all_day", { mode: "boolean" }).default(false).notNull(),
  status: text("status").$type<EventStatus>().default("confirmed").notNull(),
  recurrence: text("recurrence", { mode: "json" }).$type<string[] | null>(),

  ...notification,

  ...timestamps
});

export const eventAttendees = sqliteTable("event_attendees", {
  id: text("id").primaryKey(),

  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),

  email: text("email").notNull(),
  name: text("name"),
  status: text("status").$type<EventAttendeeStatus>().default("needsAction").notNull(),
  isSelf: integer("is_self", { mode: "boolean" }).default(false).notNull(),

  notificationSent: integer("notificationSent", { mode: "boolean" }).default(false).notNull(),

  ...timestamps
});
