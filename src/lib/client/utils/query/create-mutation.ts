import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateMutationOptions<Fn extends (...args: any[]) => Promise<any>, ErrorType> = {
  mutationFn: Fn;
  queryKeys?: string[];
  onPending?: () => void | Promise<void>;
  onMutate?: (...args: Parameters<Fn>) => void | (() => void | Promise<void>);
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void | Promise<void>;
  onError?: (err: ErrorType, ...args: Parameters<Fn>) => void | Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMutation<Fn extends (...args: any[]) => Promise<any>, ErrorType = unknown>(
  opts: CreateMutationOptions<Fn, ErrorType>
) {
  type DataType = Awaited<ReturnType<Fn>>;
  const { mutationFn, queryKeys, onPending, onMutate, onSuccess, onError } = opts;

  const data = writable<DataType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  async function mutate(...args: Parameters<Fn>): Promise<void> {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);

    let rollbackFn: (() => void | Promise<void>) | undefined;

    try {
      if (onPending) {
        await onPending();
      }

      if (onMutate) {
        const maybeRollback = onMutate(...args);
        if (typeof maybeRollback === "function") rollbackFn = maybeRollback;
      }

      const result = await mutationFn(...args);
      data.set(result);
      error.set(null);
      isSuccess.set(true);

      if (onSuccess) {
        await onSuccess(result);
      }
    } catch (err) {
      error.set(err as ErrorType);
      isError.set(true);

      if (rollbackFn) {
        await rollbackFn();
      }

      if (onError) {
        await onError(err as ErrorType, ...args);
      }
    } finally {
      if (queryKeys) {
        refetchQueries(queryKeys);
      }
      isPending.set(false);
    }
  }

  return { data, error, mutate, isPending, isSuccess, isError };
}
