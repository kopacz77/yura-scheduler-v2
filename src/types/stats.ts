export interface OverviewStats {
  totalStudents: number;
  weeklyLessons: number;
  outstandingAmount: number;
  averageProgress: number;
}

export interface DistributionStats {
  labels: string[];
  data: number[];
}

export interface ProgressStats {
  student: string;
  progress: number;
  lastLesson: string;
  nextLesson: string;
}

export interface DashboardStats {
  overview: OverviewStats;
  distribution: DistributionStats;
  progress: ProgressStats[];
}