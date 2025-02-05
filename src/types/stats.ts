import { LessonType, PaymentStatus } from '@prisma/client';

export interface Stat {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardStats {
  overview: {
    totalStudents: Stat;
    activeStudents: Stat;
    completedLessons: Stat;
    revenue: Stat;
  };
  studentActivity: {
    date: string;
    activeStudents: number;
  }[];
  lessonTypes: {
    type: LessonType;
    count: number;
  }[];
  payments: {
    status: PaymentStatus;
    count: number;
    amount: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  latestBookings: {
    id: string;
    studentName: string;
    lessonType: LessonType;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }[];
}