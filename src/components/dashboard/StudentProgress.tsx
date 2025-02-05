import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Level } from '@prisma/client';
import type { ProgressDataPoint } from '@/types/stats';

interface StudentProgressProps {
  progressData?: ProgressDataPoint[];
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

export function StudentProgress({ progressData, isLoading }: StudentProgressProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Level Distribution Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.entries(LEVEL_COLORS).map(([level, color]) => (
                <Line
                  key={level}
                  type="monotone"
                  dataKey={level}
                  stroke={color}
                  name={formatLevel(level as Level)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
