import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateMutationOptions<Fn extends (...args: any) => Promise<any>, ErrorType> = {
  mutationFn: Fn;
  queryKeys?: string[];
  onPending?: () => void;
  onMutate?: (...args: Parameters<Fn>) => (() => void) | void;
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void;
  onError?: (err: ErrorType) => void;
  onRollback?: (...args: Parameters<Fn>) => void;
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

  async function mutate(...args: Parameters<Fn>): Promise<void> {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);
    onPending?.();

    // biome-ignore lint:
    let rollbackFn: (() => void) | void = undefined;

    try {
      rollbackFn = onMutate?.(...args);

      const result = await mutationFn(...args);
      data.set(result);
      error.set(null);
      isSuccess.set(true);
      onSuccess?.(result);
      refetchQueries(queryKeys);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      isSuccess.set(false);

      if (rollbackFn) {
        rollbackFn();
      } else {
        onRollback?.(...args);
      }

      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  return { data, error, mutate, isPending, isSuccess, isError };
}
