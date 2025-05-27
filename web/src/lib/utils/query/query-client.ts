type QueryKey = string;
type RefetchFn = () => void;

const queryRegistry = new Map<QueryKey, Set<RefetchFn>>();

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
