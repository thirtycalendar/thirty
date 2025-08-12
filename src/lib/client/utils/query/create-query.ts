import { onDestroy } from "svelte";
import { writable } from "svelte/store";

import {
  getCachedQuery,
  isQueryStale,
  registerQuery,
  setCachedQuery,
  unregisterQuery
} from "./query-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateQueryOptions<Fn extends () => Promise<any>, ErrorType> = {
  queryFn: Fn;
  queryKeys: string[];
  enabled?: boolean;
  onQuery?: () => void;
  onPending?: () => void;
  onSuccess?: (data: Awaited<ReturnType<Fn>>) => void;
  onError?: (err: ErrorType) => void;
  staleTime?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createQuery<Fn extends () => Promise<any>, ErrorType = unknown>(
  opts: CreateQueryOptions<Fn, ErrorType>
) {
  const {
    queryFn,
    queryKeys,
    enabled = true,
    onQuery,
    onPending,
    onSuccess,
    onError,
    staleTime = 60_000
  } = opts;

  type DataType = Awaited<ReturnType<Fn>>;

  const data = writable<DataType | null>(null);
  const error = writable<ErrorType | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  const key = queryKeys.join("::");

  async function fetchData(force = false) {
    onQuery?.();

    const cached = getCachedQuery(key);

    if (!force && cached && !isQueryStale(key, staleTime)) {
      data.set(cached.data);
      isSuccess.set(true);
      isPending.set(false);
      return;
    }

    isPending.set(true);
    isSuccess.set(false);
    isError.set(false);
    onPending?.();

    try {
      const result = await queryFn();
      data.set(result);
      setCachedQuery(key, result);
      error.set(null);
      isSuccess.set(true);
      onSuccess?.(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.set(err);
      isError.set(true);
      onError?.(err);
    } finally {
      isPending.set(false);
    }
  }

  registerQuery(key, () => fetchData(true));

  onDestroy(() => {
    unregisterQuery(key, () => fetchData(true));
  });

  if (enabled) {
    fetchData();
  }

  return { data, error, isPending, isSuccess, isError, refetch: () => fetchData(true) };
}
