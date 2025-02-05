import { useState, useEffect } from 'react';
import { Level, LessonType, PaymentStatus } from '@prisma/client';
import type { DashboardStats } from '@/types/stats';

const mockStats: DashboardStats = {
  overview: {
    totalStudents: {
      value: 156,
      change: 12,
      trend: 'up'
    },
    activeStudents: {
      value: 132,
      change: 8,
      trend: 'up'
    },
    completedLessons: {
      value: 428,
      change: 42,
      trend: 'up'
    },
    revenue: {
      value: 42500,
      change: 3250,
      trend: 'up'
    }
  },
  studentActivity: [
    { date: '2024-01-01', activeStudents: 120 },
    { date: '2024-01-08', activeStudents: 125 },
    { date: '2024-01-15', activeStudents: 128 },
    { date: '2024-01-22', activeStudents: 130 },
    { date: '2024-01-29', activeStudents: 132 }
  ],
  distribution: [
    { level: Level.PRE_PRELIMINARY, count: 30, percentage: 19.2 },
    { level: Level.PRELIMINARY, count: 45, percentage: 28.8 },
    { level: Level.PRE_JUVENILE, count: 25, percentage: 16.0 },
    { level: Level.JUVENILE, count: 20, percentage: 12.8 },
    { level: Level.INTERMEDIATE, count: 15, percentage: 9.6 },
    { level: Level.NOVICE, count: 12, percentage: 7.7 },
    { level: Level.JUNIOR, count: 6, percentage: 3.8 },
    { level: Level.SENIOR, count: 3, percentage: 1.9 }
  ],
  lessonTypes: [
    { type: LessonType.PRIVATE, count: 285 },
    { type: LessonType.GROUP, count: 95 },
    { type: LessonType.CHOREOGRAPHY, count: 28 },
    { type: LessonType.COMPETITION_PREP, count: 20 }
  ],
  payments: [
    { status: PaymentStatus.COMPLETED, count: 385, amount: 38500 },
    { status: PaymentStatus.PENDING, count: 42, amount: 4200 },
    { status: PaymentStatus.FAILED, count: 8, amount: 800 }
  ],
  revenueByMonth: [
    { month: '2023-09', revenue: 36800 },
    { month: '2023-10', revenue: 38500 },
    { month: '2023-11', revenue: 40200 },
    { month: '2023-12', revenue: 41800 },
    { month: '2024-01', revenue: 42500 }
  ],
  latestBookings: [
    {
      id: '1',
      studentName: 'Sarah Chen',
      lessonType: LessonType.PRIVATE,
      date: '2024-02-04',
      status: 'scheduled'
    },
    {
      id: '2',
      studentName: 'Michael Kim',
      lessonType: LessonType.GROUP,
      date: '2024-02-05',
      status: 'scheduled'
    },
    {
      id: '3',
      studentName: 'Emily Taylor',
      lessonType: LessonType.CHOREOGRAPHY,
      date: '2024-02-03',
      status: 'completed'
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