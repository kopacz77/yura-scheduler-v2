'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

type SkillProgress = {
  skill: string;
  level: number;
  nextMilestone: string;
  recentImprovement: number;
};

export function LessonTracking() {
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          {
            skill: 'Spins',
            level: 75,
            nextMilestone: 'Triple Spin',
            recentImprovement: 5,
          },
          {
            skill: 'Footwork',
            level: 65,
            nextMilestone: 'Level 4 Step Sequence',
            recentImprovement: 3,
          },
          {
            skill: 'Performance',
            level: 80,
            nextMilestone: 'Advanced Expression',
            recentImprovement: 7,
          },
        ];
        setSkills(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch skill progress:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.map((skill) => (
          <div key={skill.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{skill.skill}</h4>
              <Badge variant={skill.recentImprovement > 5 ? 'default' : 'secondary'}>
                +{skill.recentImprovement}%
              </Badge>
            </div>
            <Progress value={skill.level} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Next milestone: {skill.nextMilestone}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
