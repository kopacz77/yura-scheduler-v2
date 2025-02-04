'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { Level } from '@prisma/client';

type SkillData = {
  skill: string;
  average: number;
  current: number;
};

type ProgressData = {
  studentId: string;
  name: string;
  level: Level;
  skillsData: SkillData[];
};

export function ProgressReport() {
  // Sample data - replace with actual data from API
  const progressData: ProgressData = {
    studentId: '1',
    name: 'Sarah Johnson',
    level: Level.INTERMEDIATE,
    skillsData: [
      { skill: 'Edges', average: 75, current: 85 },
      { skill: 'Turns', average: 70, current: 80 },
      { skill: 'Spins', average: 65, current: 75 },
      { skill: 'Footwork', average: 80, current: 85 },
      { skill: 'Performance', average: 75, current: 90 },
      { skill: 'Choreography', average: 70, current: 85 },
    ],
  };

  // Calculate overall improvement
  const improvementPercentage =
    progressData.skillsData.reduce((acc, curr) => acc + (curr.current - curr.average), 0) /
    progressData.skillsData.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Student Progress Report</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Student</Label>
              <Select defaultValue={progressData.studentId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={progressData.studentId}>
                    {progressData.name}
                  </SelectItem>
                  {/* Add more students */}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>Period</Label>
              <Select defaultValue="month">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">1 Month</SelectItem>
                  <SelectItem value="quarter">3 Months</SelectItem>
                  <SelectItem value="halfYear">6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{progressData.level}</div>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                +{improvementPercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {Math.max(...progressData.skillsData.map(s => s.current))}%
              </div>
              <p className="text-sm text-muted-foreground">Highest Score</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={progressData.skillsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Class Average"
                dataKey="average"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.3}
              />
              <Radar
                name="Current Level"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
