import { writable, type Writable } from "svelte/store";

import { differenceInDays, max, min, setHours, setMinutes, startOfDay } from "date-fns";

import type { AllDayLayoutInfo, Event } from "$lib/shared/types";

import { getEventDateObjects } from "../event/utils";

export function calculateAllDayLayout(
  allDayEvents: Event[],
  weekStart: Date,
  weekEnd: Date
): AllDayLayoutInfo[] {
  const sortedEvents = [...allDayEvents].sort((a, b) => {
    const startA = getEventDateObjects(a).start;
    const startB = getEventDateObjects(b).start;
    return startA.getTime() - startB.getTime();
  });

  const lanes: (string | null)[][] = [];
  const layout: AllDayLayoutInfo[] = [];

  for (const event of sortedEvents) {
    const { start, end } = getEventDateObjects(event);
    const eventStart = max([startOfDay(start), weekStart]);
    const eventEnd = min([startOfDay(end), weekEnd]);
    const startColumn = differenceInDays(eventStart, weekStart);
    const endColumn = differenceInDays(eventEnd, weekStart);

    let targetLane = 0;
    while (true) {
      if (!lanes[targetLane]) lanes[targetLane] = new Array(7).fill(null);
      const isOccupied = lanes[targetLane].slice(startColumn, endColumn + 1).some((c) => c);
      if (!isOccupied) break;
      targetLane++;
    }

    for (let i = startColumn; i <= endColumn; i++) lanes[targetLane][i] = event.id;

    layout.push({
      ...event,
      startColumn: startColumn + 1,
      span: endColumn - startColumn + 1,
      lane: targetLane
    });
  }

  return layout;
}

export interface DragCreateState {
  startY: number | null;
  endY: number | null;
  day: Date | null;
}

export function createDragCreate(hourHeight = 60, interval = 15) {
  const state: Writable<DragCreateState> = writable({ startY: null, endY: null, day: null });

  function snapToInterval(y: number) {
    const minutesPerPixel = 60 / hourHeight;
    const totalMinutes = y * minutesPerPixel;
    return Math.round(totalMinutes / interval) * interval;
  }

  function onPointerDown(e: PointerEvent, day?: Date) {
    state.update(() => ({ startY: e.offsetY, endY: e.offsetY, day: day ?? null }));
  }

  function onPointerMove(e: PointerEvent) {
    state.update((s) => (s.startY !== null ? { ...s, endY: e.offsetY } : s));
  }

  function onPointerUp(callback: (start: Date, end: Date) => void, currentDay?: Date) {
    state.update((s) => {
      if (s.startY !== null && s.endY !== null && (s.day || currentDay)) {
        const day = s.day ?? currentDay!;
        const startMinutes = snapToInterval(Math.min(s.startY, s.endY));
        const endMinutes = snapToInterval(Math.max(s.startY, s.endY));

        const startDate = setMinutes(
          setHours(day, Math.floor(startMinutes / 60)),
          startMinutes % 60
        );
        const endDate = setMinutes(setHours(day, Math.floor(endMinutes / 60)), endMinutes % 60);

        callback(startDate, endDate);
      }
      return { startY: null, endY: null, day: null };
    });
  }

  return { state, onPointerDown, onPointerMove, onPointerUp };
}
