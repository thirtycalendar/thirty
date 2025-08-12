import { get, writable, type Writable } from "svelte/store";

import { z, type ZodType } from "zod";

type CreateFormParams<T> = {
  schema: ZodType<T>;
  defaultValues: T;
  disabledFields?: (keyof T)[];
  resetOnSuccess?: boolean;
  resetDisabledFields?: (keyof T)[];
  onPending?: () => void | Promise<void>;
  onSubmit?: (data: T) => Promise<void> | void;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
  onRollback?: () => void | Promise<void>;
};

type CreateFormReturn<T> = {
  formData: Writable<T>;
  formErrors: Writable<Partial<Record<keyof T, string>>>;
  isSubmitting: Writable<boolean>;
  handleInput: (event: Event) => void;
  handleSubmit: () => (event: Event) => Promise<void>;
  setDisabledFields: (fields: (keyof T)[]) => void;
};

export const createForm = <T>({
  schema,
  defaultValues,
  disabledFields: initialDisabledFields = [],
  resetOnSuccess = true,
  resetDisabledFields = [],
  onPending,
  onSubmit,
  onSuccess,
  onError,
  onRollback
}: CreateFormParams<T>): CreateFormReturn<T> => {
  const formData = writable<T>({ ...defaultValues });
  const formErrors = writable<Partial<Record<keyof T, string>>>({});
  const isSubmitting = writable(false);
  let submitted = false;

  const disabledFields = writable<Set<keyof T>>(new Set(initialDisabledFields));
  const resetDisabledSet = new Set<keyof T>(resetDisabledFields);

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
      const { fieldErrors } = z.flattenError(result.error);
      const errorMessage = (fieldErrors[field as keyof typeof fieldErrors] || [])[0] || "";
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
      const { fieldErrors } = z.flattenError(result.error);
      let hasErrorsForEnabledFields = false;
      const newFormErrors: Partial<Record<keyof T, string>> = {};

      for (const key in fieldErrors) {
        if (!disabled.has(key as keyof T)) {
          newFormErrors[key as keyof T] = fieldErrors[key]?.[0] || "";
          hasErrorsForEnabledFields = true;
        }
      }

      formErrors.set(newFormErrors);
      return !hasErrorsForEnabledFields;
    }

    return true;
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    formData.update((data) => {
      let updatedValue: unknown;
      if (type === "number") {
        updatedValue = value === "" ? null : +value;
      } else if (type === "checkbox") {
        updatedValue = checked;
      } else {
        updatedValue = value;
      }

      const updatedData = { ...data, [name]: updatedValue } as T;

      if (submitted) {
        validateField(name as keyof T, updatedValue);
      }

      return updatedData;
    });
  }

  function handleSubmit() {
    return async (event: Event) => {
      event.preventDefault();
      submitted = true;

      const data = get(formData);
      const isValid = validateForm(data);

      if (!isValid) {
        console.log("Form validation failed.", get(formErrors));
        return;
      }

      isSubmitting.set(true);
      try {
        await onPending?.();
        if (onSubmit) {
          await onSubmit(data);
        }

        if (resetOnSuccess) {
          formData.update((current) => {
            const updated = { ...current };
            for (const key in defaultValues) {
              if (!resetDisabledSet.has(key as keyof T)) {
                updated[key as keyof T] = defaultValues[key as keyof T];
              }
            }
            return updated;
          });
        }

        onSuccess?.(data);
      } catch (error) {
        console.error("Error during form submission:", error);
        onError?.(error);
        onRollback?.();
      } finally {
        isSubmitting.set(false);
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
