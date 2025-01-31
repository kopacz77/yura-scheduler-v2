import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  skillLevel: number;
  attendance: number;
}

const mockProgressData: ProgressData[] = [
  { date: '2024-01', skillLevel: 3, attendance: 90 },
  { date: '2024-02', skillLevel: 4, attendance: 85 },
  { date: '2024-03', skillLevel: 4.5, attendance: 95 },
  { date: '2024-04', skillLevel: 5, attendance: 92 },
  { date: '2024-05', skillLevel: 5.5, attendance: 88 },
  { date: '2024-06', skillLevel: 6, attendance: 94 }
];

export function StudentProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[0, 10]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="skillLevel"
                stroke="#8884d8"
                name="Skill Level"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="attendance"
                stroke="#82ca9d"
                name="Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}