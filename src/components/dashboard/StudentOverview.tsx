'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentOverviewProps {
  distribution?: DashboardStats['distribution'];
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  value: number;
}

export function StudentOverview({ distribution, isLoading }: StudentOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartDataItem[] = distribution?.map((item) => ({
    name: item.name,
    value: item.value,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const [{ value }] = payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Students
                          </span>
                          <span className="font-bold">
                            {`${value} students (${((value as number / chartData.reduce((acc: number, cur: ChartDataItem) => acc + cur.value, 0)) * 100).toFixed(1)}%)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="value"
                fill="currentColor"
                className="fill-primary"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}