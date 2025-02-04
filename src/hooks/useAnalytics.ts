'use client';

import { useState, useCallback } from 'react';

type Revenue = {
  total: number;
  byPeriod: Array<{
    period: string;
    amount: number;
  }>;
};

type LessonStats = {
  upcomingCount: number;
  completed: number;
  cancelled: number;
};

type StudentStats = {
  activeCount: number;
  newCount: number;
  byLevel: Array<{
    level: string;
    count: number;
  }>;
};

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [lessonStats, setLessonStats] = useState<LessonStats | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      setRevenue({
        total: 15000,
        byPeriod: [
          { period: '2024-01', amount: 5000 },
          { period: '2024-02', amount: 5500 },
          { period: '2024-03', amount: 4500 },
        ],
      });

      setLessonStats({
        upcomingCount: 25,
        completed: 120,
        cancelled: 5,
      });

      setStudentStats({
        activeCount: 50,
        newCount: 8,
        byLevel: [
          { level: 'Beginner', count: 20 },
          { level: 'Intermediate', count: 20 },
          { level: 'Advanced', count: 10 },
        ],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStudentRetention = useCallback(async () => {
    // To be implemented
    console.log('Fetching student retention...');
  }, []);

  return {
    isLoading,
    revenue,
    lessonStats,
    studentStats,
    fetchAnalytics,
    getStudentRetention,
  };
}