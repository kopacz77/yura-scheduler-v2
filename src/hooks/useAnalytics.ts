'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year';

type RevenueData = {
  total: number;
  byPeriod: {
    period: string;
    amount: number;
  }[];
};

type LessonStats = {
  total: number;
  completed: number;
  cancelled: number;
  upcomingCount: number;
  byPeriod: {
    period: string;
    count: number;
  }[];
};

type StudentStats = {
  totalCount: number;
  activeCount: number;
  newCount: number;
  byLevel: {
    level: string;
    count: number;
  }[];
};

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [lessonStats, setLessonStats] = useState<LessonStats | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  const fetchAnalytics = async (period: AnalyticsPeriod = 'month') => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ period });
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setRevenue(data.revenue);
      setLessonStats(data.lessons);
      setStudentStats(data.students);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getStudentRetention = async (period: AnalyticsPeriod = 'month') => {
    try {
      const params = new URLSearchParams({ period });
      const response = await fetch(`/api/analytics/retention?${params}`);
      if (!response.ok) throw new Error('Failed to fetch retention data');

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch retention data';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getRevenueProjection = async (months: number = 3) => {
    try {
      const params = new URLSearchParams({ months: months.toString() });
      const response = await fetch(`/api/analytics/revenue-projection?${params}`);
      if (!response.ok) throw new Error('Failed to fetch revenue projection');

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projection';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    isLoading,
    error,
    revenue,
    lessonStats,
    studentStats,
    fetchAnalytics,
    getStudentRetention,
    getRevenueProjection,
  };
}