import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Color, EventAttendeeStatus, EventStatus, Source } from "$lib/shared/types";

import { notification, timestamps } from "./utils";

import { calendarTable, userTable } from ".";

export const eventTable = sqliteTable("events", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
  calendarId: text("calendar_id")
    .notNull()
    .references(() => calendarTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text("name").notNull(),
  color: text("color").$type<Color>().default("#4986e7").notNull(),
  description: text("description"),
  location: text("location"),

  startDate: text("start_date").notNull(),
  startTime: text("start_time").notNull(),
  endDate: text("end_date").notNull(),
  endTime: text("end_time").notNull(),

  timezone: text("timezone").default("UTC").notNull(),
  allDay: integer("all_day", { mode: "boolean" }).default(false).notNull(),
  status: text("status").$type<EventStatus>().default("confirmed").notNull(),
  recurrence: text("recurrence", { mode: "json" }).$type<string[] | null>(),

  ...notification,

  ...timestamps
});

export const eventAttendees = sqliteTable("event_attendees", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  email: text("email").notNull(),
  name: text("name"),
  status: text("status").$type<EventAttendeeStatus>().default("needsAction").notNull(),
  isSelf: integer("is_self", { mode: "boolean" }).default(false).notNull(),

  notificationSent: integer("notificationSent", { mode: "boolean" }).default(false).notNull(),

  ...timestamps
});

export const eventMetadata = sqliteTable("event_metadata", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  aiSummary: text("ai_summary"),
  aiTags: text("ai_tags", { mode: "json" }).$type<string[] | null>(),

  ...timestamps
});
