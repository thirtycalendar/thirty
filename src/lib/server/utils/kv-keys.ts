function key(namespace: string, ...parts: string[]): string {
  return [namespace, ...parts].join(":");
}

export const KV_CALENDARS = (userId: string) => key("calendars", userId);
export const KV_EVENTS = (userId: string) => key("events", userId);
export const KV_TASKS = (userId: string) => key("tasks", userId);
export const KV_BIRTHDAYS = (userId: string) => key("birthdays", userId);

export const KV_CHATS = (userId: string) => key("chats", userId);
export const KV_IP_LOCATION = (userId: string) => key("ip", "location", userId);

// Holiday-related keys
export const KV_HOLIDAY_COUNTRIES = (userId: string) => key("holidays", "countries", userId);
export const KV_HOLIDAYS = (userId: string) => key("holidays", userId);
export const KV_ALL_HOLIDAY_COUNTRIES = key("holidays", "countries", "all");
export const KV_COUNTRY_HOLIDAYS = (countryId: string) => key("holidays", "country", countryId);

// Sync lock keys
export const KV_SYNC_LOCK_CALENDARS = (userId: string) => key("sync", "lock", "calendars", userId);
export const KV_SYNC_LOCK_EVENTS = (userId: string) => key("sync", "lock", "events", userId);

// Static keys
export const KV_WAITING_LIST = key("waiting-list");
