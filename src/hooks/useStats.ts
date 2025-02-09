import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from '@/types/stats';

const fetchStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export function useStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
  });

  return { stats, isLoading, error };
}