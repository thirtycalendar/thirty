type QueryKey = string;
type RefetchFn = () => void;

const queryRegistry = new Map<QueryKey, Set<RefetchFn>>();
// biome-ignore lint:
const queryCache = new Map<QueryKey, { data: any; updatedAt: number }>();

const defaultStaleTime = 1000 * 60;

export function registerQuery(key: QueryKey, refetchFn: RefetchFn) {
  if (!queryRegistry.has(key)) {
    queryRegistry.set(key, new Set());
  }
  queryRegistry.get(key)?.add(refetchFn);
}

export function unregisterQuery(key: QueryKey, refetchFn: RefetchFn) {
  queryRegistry.get(key)?.delete(refetchFn);
}

export function refetchQueries(keys?: QueryKey[]) {
  if (!keys) return;

  for (const key of keys) {
    const fns = queryRegistry.get(key);
    if (fns) {
      for (const fn of fns) {
        fn();
      }
    }
  }
}

export function getCachedQuery(key: QueryKey) {
  return queryCache.get(key);
}

// biome-ignore lint:
export function setCachedQuery(key: QueryKey, data: any) {
  queryCache.set(key, { data, updatedAt: Date.now() });
}

export function isQueryStale(key: QueryKey, staleTime = defaultStaleTime): boolean {
  const cached = queryCache.get(key);
  if (!cached) return true;
  return Date.now() - cached.updatedAt > staleTime;
}
