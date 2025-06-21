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
    const isSystemCalendar = /holiday@|contacts@|birthday@/.test(gCal.id ?? "");
    const isNotOwner = gCal.accessRole !== "owner";

    if (!gCal.id || existingIds.has(gCal.id) || isSystemCalendar || isNotOwner) continue;

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

  const colorsRes = await calendar.colors.get();
  const colorMap = colorsRes.data.event ?? {};

  const userCalendars = await db
    .select({ id: calendars.id, externalId: calendars.externalId, colorId: calendars.colorId })
    .from(calendars)
    .where(and(eq(calendars.userId, userId), eq(calendars.source, "google")));

  const existing = await db
    .select({ externalId: events.externalId })
    .from(events)
    .where(and(eq(events.userId, userId), eq(events.source, "google")));

  const existingIds = new Set(existing.map((e) => e.externalId));

  for (const cal of userCalendars) {
    if (!cal.externalId) continue;

    const res = await calendar.events.list({
      calendarId: cal.externalId,
      maxResults: 2500,
      singleEvents: true,
      orderBy: "startTime"
    });

    const googleEvents = res.data.items ?? [];

    for (const gEvent of googleEvents) {
      if (!gEvent.id || existingIds.has(gEvent.id)) continue;
      if (gEvent.eventType === "birthday") continue;

      const colorHex = gEvent.colorId
        ? (colorMap[gEvent.colorId]?.background ?? "#9a9a9a")
        : "#9a9a9a";

      const data: EventForm = {
        calendarId: cal.id,
        externalId: gEvent.id,
        source: "google",
        name: gEvent.summary ?? "(No title)",
        colorId: gEvent.colorId ? getNearestColorIdFromHexCode(colorHex) : cal.colorId,
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
}
