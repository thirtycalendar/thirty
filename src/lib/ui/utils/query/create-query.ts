import { writable } from "svelte/store";

import { registerQuery } from "./query-client";

type CreateQueryOptions<ReturnType, ErrorType> = {
  queryFn: () => Promise<ReturnType>;
  queryKeys?: string[];
  onPending?: () => void;
  onSuccess?: (data: ReturnType) => void;
  onError?: (err: ErrorType) => void;
};

export function createQuery<ReturnType = unknown, ErrorType = unknown>(
  opts: CreateQueryOptions<ReturnType, ErrorType>
) {
  const { queryFn, queryKeys, onPending, onSuccess, onError } = opts;

  const data = writable<ReturnType | null>(null);
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
      isSuccess.set(false);
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
