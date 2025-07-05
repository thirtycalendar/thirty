import { and, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { calendars } from "$lib/server/db/tables/calendar";
import { events } from "$lib/server/db/tables/event";
import { getGoogleClients } from "$lib/server/calendars/google/client";
import { getLock, releaseLock, setLock } from "$lib/server/utils/lock";

import type { CalendarForm, EventForm } from "$lib/types";
import { getNearestColorIdFromHexCode } from "$lib/utils/colors";
import { KV_SYNC_LOCK_CALENDARS, KV_SYNC_LOCK_EVENTS } from "$lib/utils/kv-keys";

import { createCalendarsBulk } from "../calendar";
import { createEventsBulk } from "../event";

export async function syncGoogleCalendars(userId: string) {
  const lockKey = KV_SYNC_LOCK_CALENDARS(userId);
  if (await getLock(lockKey)) return;
  await setLock(lockKey, true, { ttl: 300 });

  try {
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

    const toCreate: CalendarForm[] = [];

    for (const gCal of list) {
      const isSystem = /holiday@|contacts@|birthday@/.test(gCal.id ?? "");
      const isNotOwner = gCal.accessRole !== "owner";
      if (!gCal.id || existingIds.has(gCal.id) || isSystem || isNotOwner) continue;

      const colorHex = colorMap[gCal.colorId as string]?.background ?? "#9a9a9a";

      toCreate.push({
        externalId: gCal.id,
        source: "google",
        name: gCal.summary ?? "(Untitled Calendar)",
        colorId: getNearestColorIdFromHexCode(colorHex),
        timezone: gCal.timeZone ?? "UTC",
        isPrimary: false
      });
    }

    if (toCreate.length > 0) {
      await createCalendarsBulk(userId, toCreate);
    }
  } finally {
    await releaseLock(lockKey);
  }
}

export async function syncGoogleEvents(userId: string) {
  const lockKey = KV_SYNC_LOCK_EVENTS(userId);
  if (await getLock(lockKey)) return;
  await setLock(lockKey, true, { ttl: 300 });

  try {
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
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const timeMin = oneYearAgo.toISOString();

    const chunks = userCalendars.map((cal) => async () => {
      const res = await calendar.events.list({
        calendarId: cal.externalId as string,
        timeMin,
        maxResults: 2500,
        singleEvents: true,
        orderBy: "startTime"
      });

      const googleEvents = res.data.items ?? [];
      const toCreate: EventForm[] = [];

      for (const gEvent of googleEvents) {
        if (!gEvent.id || existingIds.has(gEvent.id)) continue;
        if (gEvent.eventType === "birthday") continue;

        const colorHex = gEvent.colorId
          ? (colorMap[gEvent.colorId]?.background ?? "#9a9a9a")
          : "#9a9a9a";

        toCreate.push({
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
        });
      }

      if (toCreate.length > 0) {
        await createEventsBulk(userId, toCreate);
      }
    });

    for (let i = 0; i < chunks.length; i += 3) {
      await Promise.all(chunks.slice(i, i + 3).map((fn) => fn()));
    }
  } finally {
    await releaseLock(lockKey);
  }
}
