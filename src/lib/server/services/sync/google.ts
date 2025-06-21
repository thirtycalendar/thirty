import { and, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { calendars } from "$lib/server/db/schemas/calendar-table";
import { events } from "$lib/server/db/schemas/event-table";
import { getGoogleClients } from "$lib/server/calendars/google/client";

import type { CalendarForm, EventForm } from "$lib/types";
import { getNearestColorIdFromHexCode } from "$lib/utils/colors";

import { createCalendar } from "../calendar";
import { createEvent } from "../event";

export async function syncGoogleCalendars(userId: string) {
  const { calendar } = await getGoogleClients(userId);

  const res = await calendar.calendarList.list();
  const list = res.data.items ?? [];

  const existing = await db
    .select({ externalId: calendars.externalId })
    .from(calendars)
    .where(and(eq(calendars.userId, userId), eq(calendars.source, "google")));

  const existingIds = new Set(existing.map((c) => c.externalId));

  const colorsRes = await calendar.colors.get();
  const colorMap = colorsRes.data.calendar ?? {};

  for (const gCal of list) {
    if (!gCal.id || existingIds.has(gCal.id)) continue;

    const colorHex = colorMap[gCal.colorId as string]?.background ?? "#9a9a9a";

    const form: CalendarForm = {
      externalId: gCal.id,
      source: "google",
      name: gCal.summary ?? "(Untitled Calendar)",
      colorId: getNearestColorIdFromHexCode(colorHex),
      timezone: gCal.timeZone ?? "UTC",
      isPrimary: false
    };

    await createCalendar(userId, form);
  }
}

export async function syncGoogleEvents(userId: string) {
  const { calendar } = await getGoogleClients(userId);
  const res = await calendar.events.list({ calendarId: "primary", maxResults: 2500 });

  const googleEvents = res.data.items ?? [];

  const existing = await db
    .select({ externalId: events.externalId })
    .from(events)
    .where(and(eq(events.userId, userId), eq(events.source, "google")));

  const existingIds = new Set(existing.map((e) => e.externalId));

  for (const gEvent of googleEvents) {
    if (!gEvent.id || existingIds.has(gEvent.id)) continue;

    const data: EventForm = {
      calendarId: "primary",
      externalId: gEvent.id,
      source: "google",
      name: gEvent.summary ?? "(No title)",
      colorId: gEvent.colorId ?? "default",
      description: gEvent.description ?? null,
      location: gEvent.location ?? null,
      start: gEvent.start?.dateTime ?? gEvent.start?.date ?? "",
      end: gEvent.end?.dateTime ?? gEvent.end?.date ?? "",
      timezone: gEvent.start?.timeZone ?? "UTC",
      allDay: !!gEvent.start?.date,
      status: gEvent.status === "cancelled" ? "cancelled" : "confirmed"
    };

    await createEvent(userId, data);
  }
}
