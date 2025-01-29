import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { DashboardStats } from '@/types/stats';

export function useStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [overview, distribution, progress] = await Promise.all([
        fetch('/api/stats/overview').then(res => res.json()),
        fetch('/api/stats/distribution').then(res => res.json()),
        fetch('/api/stats/progress').then(res => res.json()),
      ]);

      setStats({
        overview,
        distribution,
        progress,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    isLoading,
    refreshStats,
  };
}
