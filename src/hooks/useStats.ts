import { useState, useEffect } from 'react';
import type { DashboardStats } from '@/types/stats';

const mockStats: DashboardStats = {
  overview: {
    totalStudents: 156,
    weeklyLessons: 42,
    outstandingAmount: 4250,
    averageProgress: 78
  },
  distribution: [
    { name: 'Beginner', value: 30, color: '#66BB6A' },
    { name: 'Intermediate', value: 45, color: '#42A5F5' },
    { name: 'Advanced', value: 25, color: '#7E57C2' }
  ],
  progress: [
    {
      student: 'Sarah Chen',
      progress: 85,
      lastLesson: '2024-01-28',
      nextLesson: '2024-02-04'
    },
    {
      student: 'Michael Kim',
      progress: 92,
      lastLesson: '2024-01-29',
      nextLesson: '2024-02-05'
    },
    {
      student: 'Emily Taylor',
      progress: 78,
      lastLesson: '2024-01-27',
      nextLesson: '2024-02-03'
    }
  ]
};

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}