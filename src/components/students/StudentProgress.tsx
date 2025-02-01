import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: Date;
}

interface StudentProgressProps {
  milestones: Milestone[];
}

export function StudentProgress({ milestones }: StudentProgressProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skills & Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="space-y-1">
                <h4 className="font-medium">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
                {milestone.date && (
                  <p className="text-sm text-muted-foreground">
                    {milestone.date.toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge
                variant={milestone.completed ? 'success' : 'secondary'}
                className="ml-auto"
              >
                {milestone.completed ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
