export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatsDataPoint {
  value: number;
  trend: TrendDirection;
  change: number;
}

export interface StatsProgressDataPoint {
  label: string;
  count: number;
  trend: TrendDirection;
  percentage: number;
  changePercentage: number;
}

export interface StudentDistribution {
  name: string;
  count: number;
  color: string;
}

export interface DashboardStats {
  totalStudents: StatsDataPoint;
  activeStudents: StatsDataPoint;
  revenue: StatsDataPoint;
  completedLessons: StatsDataPoint;
  monthlyProgress: StatsProgressDataPoint[];
  distribution: StudentDistribution[];
}