type QueryKey = string;
type RefetchFn = () => void;

// biome-ignore lint:
const globalScope = globalThis as any;

globalScope.__queryRegistry ??= new Map<QueryKey, Set<RefetchFn>>();
// biome-ignore lint:
globalScope.__queryCache ??= new Map<QueryKey, { data: any; updatedAt: number }>();

const queryRegistry: Map<QueryKey, Set<RefetchFn>> = globalScope.__queryRegistry;
// biome-ignore lint:
const queryCache: Map<QueryKey, { data: any; updatedAt: number }> = globalScope.__queryCache;

const defaultStaleTime = 1000 * 60;

export function registerQuery(key: QueryKey, refetchFn: RefetchFn) {
  console.log("Registering...:", key);

  if (!queryRegistry.has(key)) {
    queryRegistry.set(key, new Set());
  }
  queryRegistry.get(key)?.add(refetchFn);
}

export function unregisterQuery(key: QueryKey, refetchFn: RefetchFn) {
  console.log("Unregistering...:", key);

  const set = queryRegistry.get(key);
  if (!set) return;

  set.delete(refetchFn);
  if (set.size === 0) queryRegistry.delete(key);
}

export function refetchQueries(keys?: QueryKey[]) {
  if (!keys) return;
  console.log("Refetching...:", keys);

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
