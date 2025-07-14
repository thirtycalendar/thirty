import type { Holiday, HolidayCountry } from "$lib/shared/types";

import { createModalStore } from "./modal";

export const {
  currentDetails: currentHdCountryDetails,
  modalId: hdCountryModalId,
  createModalId: hdCountryAddModalId,
  handleModal: handleHdCountryModal
} = createModalStore<HolidayCountry>("hd-country");

export const {
  currentDetails: currentHdDetails,
  modalId: hdModalId,
  handleModal: handleHdModal
} = createModalStore<Holiday>("hd");
