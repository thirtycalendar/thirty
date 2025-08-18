export const KV_CALENDARS = (userId: string) => `calendars:${userId}`;

export const KV_EVENTS = (userId: string) => `events:${userId}`;

export const KV_TASKS = (userId: string) => `tasks:${userId}`;

export const KV_BIRTHDAYS = (userId: string) => `birthdays:${userId}`;

export const KV_HOLIDAY_COUNTRIES = (userId: string) => `holidays:countries:${userId}`;
export const KV_HOLIDAYS = (userId: string) => `holidays:${userId}`;

export const KV_CHATS = (userId: string) => `chats:${userId}`;

export const KV_ALL_HOLIDAY_COUNTRIES = "all:holiday:countries";
export const KV_COUNTRY_HOLIDAYS = (countryId: string) => `${countryId}:holidays`;

export const KV_IP_LOCATION = (userId: string) => `ip:location:${userId}`;

export const KV_GOOGLE_TOKEN = (userId: string) => `google:token:${userId}`;

export const KV_SYNC_LOCK_CALENDARS = (userId: string) => `sync:lock:calendars:${userId}`;

export const KV_SYNC_LOCK_EVENTS = (userId: string) => `sync:lock:events:${userId}`;

export const KV_WAITING_LIST = `waiting-list`;
