import { writable, get, type Writable } from "svelte/store";
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
  handleSubmit: (
    callback: (data: T) => Promise<void> | void,
  ) => (event: Event) => void;
  setDisabledFields: (fields: (keyof T)[]) => void;
};

export const createForm = <T>({
  schema,
  defaultValues,
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

    const result = schema.safeParse({ ...get(formData), [field]: value });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<
        keyof T,
        string[]
      >;
      formErrors.update((e) => ({
        ...e,
        [field]: fieldErrors[field]?.[0] || "",
      }));
    } else {
      formErrors.update((e) => ({ ...e, [field]: "" }));
    }
  }

  function validateForm(data: T): boolean {
    const disabled = get(disabledFields);
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<
        keyof T,
        string[]
      >;

      formErrors.set(
        Object.fromEntries(
          Object.entries(fieldErrors)
            .filter(([key]) => !disabled.has(key as keyof T))
            .map(([key, value]) => [key, (value as string[])[0]]),
        ) as Partial<Record<keyof T, string>>,
      );

      // Check if there are any remaining errors after filtering out disabled fields
      return Object.keys(get(formErrors)).length === 0;
    }

    formErrors.set({});
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
        } finally {
          isSubmitting.set(false);
        }
      }
    };
  }

  return {
    formData,
    formErrors,
    isSubmitting,
    handleInput,
    handleSubmit,
    setDisabledFields,
  };
};
