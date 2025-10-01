import { getAuth } from "$lib/server/auth";
import { getDb } from "$lib/server/db";

import type * as Const from "$lib/shared/constants";

// Messages

// Enums and Constants
export type MessageRole = (typeof Const.MessageRole)[number];
export type SubscriptionPlan = (typeof Const.SubscriptionPlans)[number];
export type Color = (typeof Const.Colors)[number];
export type Source = (typeof Const.Sources)[number];
export type EventStatus = (typeof Const.EventStatuses)[number];
export type EventAttendeeStatus = (typeof Const.AttendeeStatuses)[number];
export type TaskStatus = (typeof Const.TaskStatuses)[number];
export type NotifyInMin = (typeof Const.NotificationMinutes)[number];
export type NotifyInDay = (typeof Const.NotificationDays)[number];

// Clients
export type DbClient = ReturnType<typeof getDb>;
export type AuthClient = ReturnType<typeof getAuth>;
