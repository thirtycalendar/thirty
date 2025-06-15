import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { EventAttendeeStatus, EventStatus, Source } from "$lib/types/server";

import { user } from "./auth-table";
import { calendars } from "./calendar-table";
import { notificationSent, timestamps } from "./utils";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  calendarId: uuid("calendar_id")
    .notNull()
    .references(() => calendars.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  colorId: text("colorId").notNull(),
  description: text("description"),
  location: text("location"),
  start: timestamp("start", { withTimezone: true, mode: "string" }).notNull(),
  end: timestamp("end", { withTimezone: true, mode: "string" }).notNull(),
  allDay: boolean("all_day").default(false),
  status: text("status").$type<EventStatus>().default("confirmed"),
  recurrence: jsonb("recurrence").$type<string[] | null>(),

  ...notificationSent,

  ...timestamps
});

export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  email: text("email").notNull(),
  name: text("name"),
  status: text("status").$type<EventAttendeeStatus>(),
  isSelf: boolean("is_self").default(false)
});

export const eventMetadata = pgTable("event_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  aiSummary: text("ai_summary"),
  aiTags: jsonb("ai_tags").$type<string[] | null>()
});
