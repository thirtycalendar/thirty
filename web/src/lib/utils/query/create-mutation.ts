import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

type CreateMutationOptions<ErrorType, ReturnType, InputType> = {
  mutationFn: (data: InputType) => Promise<ReturnType>;
  queryKeys: string[];
  onPending?: () => void;
  onSuccess?: (data: ReturnType) => void;
  onError?: (err: ErrorType) => void;
};

export function createMutation<
  ErrorType = unknown,
  ReturnType = unknown,
  InputType = unknown,
>(opts: CreateMutationOptions<ErrorType, ReturnType, InputType>) {
  const { mutationFn, queryKeys, onPending, onSuccess, onError } = opts;

  const data = writable<ReturnType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  async function mutate(payload: InputType) {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);
    onPending?.();

    try {
      const result = await mutationFn(payload);
      data.set(result);
      isSuccess.set(true);
      error.set(null);
      onSuccess?.(result);

      // Refetch any queries that match mutation queryKeys
      refetchQueries(queryKeys);
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  return { data, error, mutate, isPending, isSuccess, isError };
}
