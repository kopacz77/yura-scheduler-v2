import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Level } from '@prisma/client';
import type { DashboardStats } from '@/types/stats';

interface StudentOverviewProps {
  distribution?: DashboardStats['distribution'];
  isLoading: boolean;
}

const LEVEL_COLORS: Record<Level, string> = {
  [Level.PRE_PRELIMINARY]: '#22c55e',  // Green
  [Level.PRELIMINARY]: '#3b82f6',      // Blue
  [Level.PRE_JUVENILE]: '#a855f7',     // Purple
  [Level.JUVENILE]: '#ec4899',         // Pink
  [Level.INTERMEDIATE]: '#f59e0b',     // Orange
  [Level.NOVICE]: '#ef4444',          // Red
  [Level.JUNIOR]: '#6366f1',          // Indigo
  [Level.SENIOR]: '#0ea5e9',          // Sky Blue
};

const formatLevel = (level: Level): string => {
  return level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export function StudentOverview({ distribution, isLoading }: StudentOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = distribution?.map(item => ({
    name: formatLevel(item.level),
    value: item.count,
    level: item.level,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={entry.level} 
                    fill={LEVEL_COLORS[entry.level as Level]} 
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} students (${((value as number / chartData.reduce((acc, cur) => acc + cur.value, 0)) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}