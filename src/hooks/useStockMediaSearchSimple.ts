import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export function useStockMediaSearch(query: string) {
  return useQuery({
    queryKey: ['stockMediaSearch', query],
    queryFn: () =>
      apiClient.get('/stocksearch', { params: { query } }).then((res) => (res as { data: { results: unknown } }).data.results)
  });
}
