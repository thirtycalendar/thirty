// ----- Google -----

// Token
export const KV_GOOGLE_TOKEN = (userId: string) => `google:token:${userId}`;

// Calendar
export const KV_GOOGLE_CALENDARS = (userId: string) => `google:calendars:${userId}`;
export const KV_GOOGLE_EVENTS = (userId: string) => `google:events:${userId}`;
export const KV_GOOGLE_UTIL_EVENTS = (userId: string) => `google:util_events:${userId}`;
export const KV_GOOGLE_TASKS = (userId: string) => `google:tasks:${userId}`;
