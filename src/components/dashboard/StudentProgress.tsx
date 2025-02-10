'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StudentProgressProps {
  progressData?: {
    name: string;
    current: number;
    total: number;
  }[];
  isLoading?: boolean;
}

export function StudentProgress({ progressData = [], isLoading }: StudentProgressProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-2 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((item.current / item.total) * 100)}%
                </span>
              </div>
              <Progress value={(item.current / item.total) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}