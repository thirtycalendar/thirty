import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Source } from "$lib/types/server";

import { user } from "./auth-table";
import { calendars } from "./calendar-table";
import { timestamps } from "./utils";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  calendarId: uuid("calendar_id")
    .notNull()
    .references(() => calendars.id, { onDelete: "cascade" }),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local"),
  title: text("title").notNull(),
  colorId: text("colorId"),
  description: text("description"),
  location: text("location"),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  allDay: boolean("all_day").default(false),
  status: text("status").$type<"confirmed" | "cancelled" | "tentative">().default("confirmed"),
  recurrence: jsonb("recurrence").$type<string[] | null>(),

  ...timestamps
});

export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  name: text("name"),
  responseStatus: text("response_status").$type<
    "accepted" | "declined" | "tentative" | "needsAction"
  >(),
  isSelf: boolean("is_self").default(false)
});

export const eventMetadata = pgTable("event_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  aiSummary: text("ai_summary"),
  aiTags: jsonb("ai_tags").$type<string[] | null>(),
  summaryEmbedding: jsonb("summary_embedding").$type<number[] | null>(),
  manualTags: jsonb("manual_tags").$type<string[] | null>(),
  priority: integer("priority"),
  visibility: text("visibility").$type<"default" | "public" | "private">().default("default")
});
