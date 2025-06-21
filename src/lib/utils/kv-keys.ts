export const KV_CALENDARS = (userId: string) => `calendars:${userId}`;
export const KV_EVENTS = (userId: string) => `events:${userId}`;
export const KV_TASKS = (userId: string) => `tasks:${userId}`;

// Google
export const KV_GOOGLE_TOKEN = (userId: string) => `google:token:${userId}`;

// Sync lock keys
export const KV_SYNC_LOCK_CALENDARS = (userId: string) => `sync:lock:calendars:${userId}`;
export const KV_SYNC_LOCK_EVENTS = (userId: string) => `sync:lock:events:${userId}`;
