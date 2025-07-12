import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Holiday, HolidayCountry } from "$lib/shared/types";

import { toggleModal } from "../components/utils";

export const currentHolidayDetails = writable<Holiday | null>();
export const currentHolidayCountryDetails = writable<HolidayCountry | null>();

export async function handleHolidayModal(hd: Holiday) {
  const current = get(currentHolidayDetails);

  if (current?.name === hd.name) {
    currentHolidayDetails.set(null);
    await tick();
  }

  currentHolidayDetails.set(hd);
  await tick();
  toggleModal(hd.name);
}

export async function handleHolidayCountryModal(hdCountry: HolidayCountry) {
  const current = get(currentHolidayCountryDetails);

  if (current?.id === hdCountry.id) {
    currentHolidayCountryDetails.set(null);
    await tick();
  }

  currentHolidayCountryDetails.set(hdCountry);
  await tick();
  toggleModal(hdCountry.id);
}

export const holidayModalId = "holiday-modal-id";
export const holidayCountryAddModalId = "holiday-country-add-modal-id";
