type QueryKey = string;
type RefetchFn = (force?: boolean) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalScope = globalThis as any;

globalScope.__queryRegistry ??= new Map<QueryKey, Set<RefetchFn>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalScope.__queryCache ??= new Map<QueryKey, { data: any; updatedAt: number }>();

const queryRegistry: Map<QueryKey, Set<RefetchFn>> = globalScope.__queryRegistry;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryCache: Map<QueryKey, { data: any; updatedAt: number }> = globalScope.__queryCache;

const defaultStaleTime = 1000 * 60;

export function registerQuery(key: QueryKey, refetchFn: RefetchFn) {
  // console.log("Registering...:", key);

  if (!queryRegistry.has(key)) {
    queryRegistry.set(key, new Set());
  }
  queryRegistry.get(key)?.add(refetchFn);
}

export function unregisterQuery(key: QueryKey, refetchFn: RefetchFn) {
  // console.log("Unregistering...:", key);

  const set = queryRegistry.get(key);
  if (!set) return;

  set.delete(refetchFn);
  if (set.size === 0) queryRegistry.delete(key);
}

export function refetchQueries(keys?: QueryKey[], force = true) {
  if (!keys) return;
  // console.log("Refetching...:", keys, "force:", force);

  for (const key of keys) {
    const fns = queryRegistry.get(key);
    if (fns) {
      for (const fn of fns) {
        try {
          fn(force);
        } catch (err) {
          console.error("Error calling refetch fn for", key, err);
        }
      }
    }
  }
}

export function getCachedQuery(key: QueryKey) {
  return queryCache.get(key);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setCachedQuery(key: QueryKey, data: any) {
  queryCache.set(key, { data, updatedAt: Date.now() });
}

export function isQueryStale(key: QueryKey, staleTime = defaultStaleTime): boolean {
  const cached = queryCache.get(key);
  if (!cached) return true;
  return Date.now() - cached.updatedAt > staleTime;
}
