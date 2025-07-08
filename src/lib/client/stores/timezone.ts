import { writable } from "svelte/store";

import { getValidTimeZone } from "$lib/shared/utils/timezone";

export const userTimezone = writable(getValidTimeZone());
