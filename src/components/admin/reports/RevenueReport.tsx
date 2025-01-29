'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type RevenueData = {
  date: string;
  revenue: number;
  lessons: number;
};

export function RevenueReport() {
  const [timeframe, setTimeframe] = useState('week');

  // Sample data - replace with actual data from API
  const data: RevenueData[] = [
    { date: 'Mon', revenue: 1200, lessons: 8 },
    { date: 'Tue', revenue: 1500, lessons: 10 },
    { date: 'Wed', revenue: 1100, lessons: 7 },
    { date: 'Thu', revenue: 1800, lessons: 12 },
    { date: 'Fri', revenue: 1600, lessons: 11 },
    { date: 'Sat', revenue: 2200, lessons: 15 },
    { date: 'Sun', revenue: 900, lessons: 6 },
  ];

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalLessons = data.reduce((acc, curr) => acc + curr.lessons, 0);
  const averageRevenuePerLesson = totalRevenue / totalLessons;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Report</CardTitle>
          <div className="flex items-center gap-2">
            <Label>Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                ${averageRevenuePerLesson.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Revenue per Lesson</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Revenue ($)"
              />
              <Bar
                yAxisId="right"
                dataKey="lessons"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                name="Lessons"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
