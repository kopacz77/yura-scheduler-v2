import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', students: 100, attendance: 90 },
  { name: 'Feb', students: 120, attendance: 95 },
  { name: 'Mar', students: 140, attendance: 88 },
  { name: 'Apr', students: 160, attendance: 92 },
  { name: 'May', students: 180, attendance: 94 },
  { name: 'Jun', students: 200, attendance: 91 }
];

export function Overview() {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Student Growth & Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: '#2563eb',
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: '#16a34a',
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}