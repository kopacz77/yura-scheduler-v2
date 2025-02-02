'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type StudentLevel = {
  level: string;
  count: number;
};

type StudentStatsProps = {
  data: StudentLevel[];
};

export function StudentStats({ data }: StudentStatsProps) {
  const totalStudents = data.reduce((sum, level) => sum + level.count, 0);

  return (
    <div className="space-y-4">
      {data.map((level) => {
        const percentage = (level.count / totalStudents) * 100;

        return (
          <div key={level.level} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{level.level}</span>
              <span className="text-sm text-muted-foreground">
                {level.count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
        <div>
          <div className="text-sm font-medium">Total Students</div>
          <div className="mt-1 text-2xl font-bold">{totalStudents}</div>
        </div>
        <div>
          <div className="text-sm font-medium">Average Level</div>
          <div className="mt-1 text-2xl font-bold">
            {data.length > 0 ? 
              Math.round(data.reduce((sum, level, i) => 
                sum + (level.count * (i + 1)), 0) / totalStudents * 10) / 10 
              : 'N/A'
            }
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Level Distribution</h4>
        <div className="flex h-4 rounded-full overflow-hidden">
          {data.map((level, index) => {
            const width = (level.count / totalStudents) * 100;
            const colors = [
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-red-500',
              'bg-purple-500',
            ];

            return (
              <div
                key={level.level}
                className={`${colors[index % colors.length]} h-full`}
                style={{ width: `${width}%` }}
                title={`${level.level}: ${level.count} students (${width.toFixed(1)}%)`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          {data.map((level, index) => (
            <div key={level.level} className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${[
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-yellow-500',
                  'bg-red-500',
                  'bg-purple-500',
                ][index % 5]}`}
              />
              <span className="text-sm text-muted-foreground">{level.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}