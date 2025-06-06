import { writable } from "svelte/store";

import { registerQuery } from "./query-client";

// biome-ignore lint:
type CreateQueryOptions<Fn extends () => Promise<any>, ErrorType> = {
  queryFn: Fn;
  queryKeys?: string[];
  onPending?: () => void;
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void;
  onError?: (err: ErrorType) => void;
};

// biome-ignore lint:
export function createQuery<Fn extends () => Promise<any>, ErrorType = unknown>(
  opts: CreateQueryOptions<Fn, ErrorType>
) {
  const { queryFn, queryKeys, onPending, onSuccess, onError } = opts;

  type DataType = Awaited<ReturnType<Fn>>;

  const data = writable<DataType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  async function fetchData() {
    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);
    onPending?.();

    try {
      const result = await queryFn();
      data.set(result);
      error.set(null);
      isSuccess.set(true);
      onSuccess?.(result);
      // biome-ignore lint:
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  if (queryKeys) {
    for (const key of queryKeys) {
      registerQuery(key, fetchData);
    }
  }

  fetchData();

  return { data, error, isPending, isSuccess, isError };
}
