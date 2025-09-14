import { onMount } from "svelte";
import { writable } from "svelte/store";

import {
  getCachedQuery,
  isQueryStale,
  registerQuery,
  setCachedQuery,
  unregisterQuery
} from "./query-client";

type CreateQueryOptions<TData, TError> = {
  queryFn: () => Promise<TData>;
  queryKeys: string[];
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  onQuery?: () => void;
  onPending?: () => void;
  onSuccess?: (data: TData) => void;
  onError?: (err: TError) => void;
  staleTime?: number;
};

export function createQuery<TData, TError = unknown>(opts: CreateQueryOptions<TData, TError>) {
  const {
    queryFn,
    queryKeys,
    enabled = true,
    refetchOnWindowFocus = false,
    onQuery,
    onPending,
    onSuccess,
    onError,
    staleTime = 60_000
  } = opts;

  const data = writable<TData | null>(null);
  const error = writable<TError | null>(null);
  const isPending = writable(false);
  const isSuccess = writable(false);
  const isError = writable(false);

  const key = queryKeys.join("::");

  function refetchFn() {
    fetchData(true);
  }

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
    } catch (err) {
      error.set(err as TError);
      isError.set(true);
      onError?.(err as TError);
    } finally {
      isPending.set(false);
    }
  }

  onMount(() => {
    registerQuery(key, refetchFn);
    if (enabled) {
      fetchData();
    }

    let handleVisibilityChange: (() => void) | undefined;

    if (refetchOnWindowFocus) {
      handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          refetchFn();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      unregisterQuery(key, refetchFn);
      if (handleVisibilityChange) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  });

  return { data, error, isPending, isSuccess, isError, refetch: refetchFn };
}
