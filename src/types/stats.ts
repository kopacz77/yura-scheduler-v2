export interface ProgressDataPoint {
  month: string; // e.g., 'Jan', 'Feb', etc.
  beginner: number;
  intermediate: number;
  advanced: number;
  competitive: number;
}

export interface OverviewStats {
  totalStudents: number;
  weeklyLessons: number;
  outstandingAmount: number;
  averageProgress: number;
}

export interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  averageAttendance: number;
  progressData: ProgressDataPoint[];
}

export interface RevenueStats {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}

export interface RinkStats {
  totalCapacity: number;
  currentUtilization: number;
  peakHours: string[];
  maintenanceSchedule: {
    date: string;
    duration: number;
    type: string;
  }[];
}