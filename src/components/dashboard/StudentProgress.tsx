import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProgressDataPoint } from '@/types/stats';

interface StudentProgressProps {
  progressData?: ProgressDataPoint[];
  isLoading: boolean;
}

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
        <CardTitle>Student Progress Over Time</CardTitle>
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
              <Line 
                type="monotone" 
                dataKey="beginner" 
                stroke="#22c55e"
                name="Beginners"
              />
              <Line 
                type="monotone" 
                dataKey="intermediate" 
                stroke="#3b82f6"
                name="Intermediate"
              />
              <Line 
                type="monotone" 
                dataKey="advanced" 
                stroke="#a855f7"
                name="Advanced"
              />
              <Line 
                type="monotone" 
                dataKey="competitive" 
                stroke="#ef4444"
                name="Competitive"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
