export interface DashboardStats {
  overview: {
    totalStudents: number;
    activeStudents: number;
    revenue: number;
    completedLessons: number;
  };
  distribution: Array<{
    name: string;
    value: number;
  }>;
  progress: Array<{
    name: string;
    value: number;
    total: number;
  }>;
}