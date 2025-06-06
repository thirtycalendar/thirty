import { writable } from "svelte/store";

import { refetchQueries } from "./query-client";

// biome-ignore lint:
type CreateMutationOptions<Fn extends (...args: any) => Promise<any>, ErrorType> = {
  mutationFn: Fn;
  queryKeys?: string[];
  onPending?: () => void;
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void;
  onError?: (err: ErrorType) => void;
};

// biome-ignore lint:
export function createMutation<Fn extends (...args: any) => Promise<any>, ErrorType = unknown>(
  opts: CreateMutationOptions<Fn, ErrorType>
) {
  const { mutationFn, queryKeys, onPending, onSuccess, onError } = opts;

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

    try {
      const result = await mutationFn(...args);
      data.set(result);
      error.set(null);
      isSuccess.set(true);
      onSuccess?.(result);
      refetchQueries(queryKeys);
      // biome-ignore lint:
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      isSuccess.set(false);
      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  return { data, error, mutate, isPending, isSuccess, isError };
}
