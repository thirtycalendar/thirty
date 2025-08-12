import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateMutationOptions<Fn extends (...args: any) => Promise<any>, ErrorType> = {
  mutationFn: Fn;
  queryKeys?: string[];
  onPending?: () => void | Promise<void>;
  onMutate?: (...args: Parameters<Fn>) => (() => void | Promise<void>) | void;
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void | Promise<void>;
  onError?: (err: ErrorType) => void | Promise<void>;
  onRollback?: (...args: Parameters<Fn>) => void | Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createMutation<Fn extends (...args: any) => Promise<any>, ErrorType = unknown>(
  opts: CreateMutationOptions<Fn, ErrorType>
) {
  const { mutationFn, queryKeys, onPending, onMutate, onSuccess, onError, onRollback } = opts;

  type DataType = Awaited<ReturnType<Fn>>;

  const data = writable<DataType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  async function mutate(...args: [...Parameters<Fn>]): Promise<void> {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);

    let rollbackFn: void | (() => void | Promise<void>) = undefined;

    try {
      await onPending?.();

      if (onMutate) {
        rollbackFn = onMutate(...args);
      }

      const result = await mutationFn(...args);
      data.set(result);
      error.set(null);
      isSuccess.set(true);

      await onSuccess?.(result);
      refetchQueries(queryKeys);
    } catch (err: unknown) {
      error.set(err as ErrorType);
      isError.set(true);
      isSuccess.set(false);

      console.error("Mutation error:", err);

      if (rollbackFn) {
        await rollbackFn();
      } else {
        await onRollback?.(...args);
      }

      await onError?.(err as ErrorType);
    } finally {
      isPending.set(false);
    }
  }

  return { data, error, mutate, isPending, isSuccess, isError };
}
