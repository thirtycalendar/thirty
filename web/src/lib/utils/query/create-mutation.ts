import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

type CreateMutationOptions<
  ErrorType,
  ReturnType,
  // biome-ignore lint:
  Fn extends (...args: any) => Promise<ReturnType>
> = {
  mutationFn: Fn;
  queryKeys?: string[];
  onPending?: () => void;
  onSuccess?: (data: ReturnType) => void;
  onError?: (err: ErrorType) => void;
};

export function createMutation<
  ErrorType = unknown,
  ReturnType = unknown,
  // biome-ignore lint:
  Fn extends (...args: any) => Promise<ReturnType> = (...args: any) => Promise<ReturnType>
>(opts: CreateMutationOptions<ErrorType, ReturnType, Fn>) {
  const { mutationFn, queryKeys, onPending, onSuccess, onError } = opts;

  const data = writable<ReturnType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  async function mutate(...args: Parameters<Fn>): Promise<void> {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);
    onPending?.();

    try {
      const result = await mutationFn(...args);
      data.set(result);
      isSuccess.set(true);
      error.set(null);
      onSuccess?.(result);
      refetchQueries(queryKeys);
      // biome-ignore lint:
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
