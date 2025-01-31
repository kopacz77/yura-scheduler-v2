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

export interface ProgressStats {
  student: string;
  progress: number;
  lastLesson: string;
  nextLesson: string;
}

export interface DashboardStats {
  overview: OverviewStats;
  distribution: DistributionItem[];
  progress: ProgressStats[];
}