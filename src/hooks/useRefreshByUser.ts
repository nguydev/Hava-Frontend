import { useCallback, useState } from 'react';

/**
 * Wraps a query `refetch` so it can drive a RefreshControl:
 * exposes an `isRefreshing` flag distinct from the query's own loading state.
 */
export function useRefreshByUser(refetch: () => Promise<unknown>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);
  return { isRefreshing, onRefresh };
}
