'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LessonProgressProps {
  totalLessons: number;
  completedLessons: number;
  title?: string;
  showPercentage?: boolean;
}

export function LessonProgress({
  totalLessons,
  completedLessons,
  title = 'Lesson Progress',
  showPercentage = true,
}: LessonProgressProps) {
  const percentage = Math.round((completedLessons / totalLessons) * 100) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedLessons} of {totalLessons} lessons completed</span>
            {showPercentage && <span>{percentage}%</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
