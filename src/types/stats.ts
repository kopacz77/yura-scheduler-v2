export interface OverviewStats {
  totalStudents: number;
  weeklyLessons: number;
  outstandingAmount: number;
  averageProgress: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface ProgressDataPoint {
  month: string;
  beginner: number;
  intermediate: number;
  advanced: number;
  competitive: number;
}

export interface DashboardStats {
  overview: OverviewStats;
  distribution: DistributionItem[];
  progress: ProgressDataPoint[];
}
