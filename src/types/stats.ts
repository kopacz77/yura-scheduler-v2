import { LessonType, PaymentStatus, Level } from '@prisma/client';

export interface Stat {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ProgressDataPoint {
  month: string;
  [Level.PRE_PRELIMINARY]: number;
  [Level.PRELIMINARY]: number;
  [Level.PRE_JUVENILE]: number;
  [Level.JUVENILE]: number;
  [Level.INTERMEDIATE]: number;
  [Level.NOVICE]: number;
  [Level.JUNIOR]: number;
  [Level.SENIOR]: number;
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
  distribution: {
    level: Level;
    count: number;
    percentage: number;
  }[];
  progress: ProgressDataPoint[];
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