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
    <Card>
      <CardHeader>
        <CardTitle>Student Growth & Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#8884d8" />
              <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}