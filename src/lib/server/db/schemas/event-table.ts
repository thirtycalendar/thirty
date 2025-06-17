import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { EventAttendeeStatus, EventStatus, Source } from "$lib/types";

import { user } from "./auth-table";
import { calendars } from "./calendar-table";
import { notification, timestamps } from "./utils";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  calendarId: uuid("calendar_id")
    .notNull()
    .references(() => calendars.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  colorId: text("colorId").notNull(),
  description: text("description"),
  location: text("location"),
  start: timestamp("start", { withTimezone: true, mode: "string" }).notNull(),
  end: timestamp("end", { withTimezone: true, mode: "string" }).notNull(),
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
    .references(() => events.id, { onDelete: "cascade" }),

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
    .references(() => events.id, { onDelete: "cascade" }),

  aiSummary: text("ai_summary"),
  aiTags: jsonb("ai_tags").$type<string[] | null>(),

  ...timestamps
});
