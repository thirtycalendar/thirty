import { get, writable, type Writable } from "svelte/store";

import type { ZodSchema } from "zod";

type CreateFormParams<T> = {
  schema: ZodSchema<T>;
  defaultValues: T;
};

type CreateFormReturn<T> = {
  formData: Writable<T>;
  formErrors: Writable<Partial<Record<keyof T, string>>>;
  isSubmitting: Writable<boolean>;
  handleInput: (event: Event) => void;
  handleSubmit: (callback: (data: T) => Promise<void> | void) => (event: Event) => void;
  setDisabledFields: (fields: (keyof T)[]) => void;
};

export const createForm = <T>({
  schema,
  defaultValues
}: CreateFormParams<T>): CreateFormReturn<T> => {
  const formData = writable<T>({ ...defaultValues });
  const formErrors = writable<Partial<Record<keyof T, string>>>({});
  const isSubmitting = writable(false);
  let submitted = false;

  const disabledFields = writable<Set<keyof T>>(new Set());

  function setDisabledFields(fields: (keyof T)[]) {
    disabledFields.set(new Set(fields));
  }

  function validateField(field: keyof T, value: unknown) {
    if (get(disabledFields).has(field)) {
      formErrors.update((e) => ({ ...e, [field]: "" }));
      return;
    }

    const currentFormData = get(formData);
    const dataForValidation = { ...currentFormData, [field]: value };

    const result = schema.safeParse(dataForValidation);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<keyof T, string[]>;
      const errorMessage = fieldErrors[field]?.[0] || "";
      formErrors.update((e) => ({
        ...e,
        [field]: errorMessage
      }));
    } else {
      formErrors.update((e) => ({ ...e, [field]: "" }));
    }
  }

  function validateForm(data: T): boolean {
    const disabled = get(disabledFields);
    const result = schema.safeParse(data);

    formErrors.set({});

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<keyof T, string[]>;
      let hasErrorsForEnabledFields = false;
      const newFormErrors: Partial<Record<keyof T, string>> = {};

      for (const key in fieldErrors) {
        if (!disabled.has(key as keyof T)) {
          newFormErrors[key as keyof T] = fieldErrors[key]?.[0] || "";
          hasErrorsForEnabledFields = true;
        }
      }
      formErrors.set(newFormErrors);

      const isValid = !hasErrorsForEnabledFields;
      return isValid;
    }

    return true;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    formData.update((data) => {
      let updatedValue: unknown;

      // Handle different input types
      if (type === "number") {
        updatedValue = value === "" ? null : +value;
      } else if (type === "checkbox") {
        updatedValue = checked;
      } else {
        updatedValue = value;
      }

      const updatedData = { ...data, [name]: updatedValue } as T;

      // Only validate the field after the first submission
      if (submitted) {
        validateField(name as keyof T, updatedValue);
      }

      return updatedData;
    });
  }

  function handleSubmit(callback: (data: T) => Promise<void> | void) {
    return async (event: Event) => {
      event.preventDefault();
      submitted = true;

      const data = get(formData);
      const isValid = validateForm(data);

      if (isValid) {
        isSubmitting.set(true);
        try {
          await callback(data);
        } catch (e) {
          console.error("Error during form submission callback:", e);
        } finally {
          isSubmitting.set(false);
        }
      } else {
        console.log("Form validation failed. Errors:", get(formErrors));
      }
    };
  }

  return {
    formData,
    formErrors,
    isSubmitting,
    handleInput,
    handleSubmit,
    setDisabledFields
  };
};
