import { writable } from "svelte/store";

import { registerQuery } from "./query-client";

type CreateQueryOptions<ErrorType, ReturnType> = {
  queryFn: () => Promise<ReturnType>;
  queryKeys: string[];
  onPending?: () => void;
  onSuccess?: (data: ReturnType) => void;
  onError?: (err: ErrorType) => void;
};

export function createQuery<ErrorType = unknown, ReturnType = unknown>(
  opts: CreateQueryOptions<ErrorType, ReturnType>,
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
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  queryKeys.forEach((key) => registerQuery(key, fetchData));
  fetchData();

  return { data, error, isPending, isSuccess, isError };
}
