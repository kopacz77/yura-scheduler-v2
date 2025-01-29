'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type AttendanceData = {
  month: string;
  attendance: number;
  cancellations: number;
  noShows: number;
};

export function AttendanceReport() {
  // Sample data - replace with actual data from API
  const data: AttendanceData[] = [
    { month: 'Jan', attendance: 95, cancellations: 3, noShows: 2 },
    { month: 'Feb', attendance: 92, cancellations: 5, noShows: 3 },
    { month: 'Mar', attendance: 88, cancellations: 8, noShows: 4 },
    { month: 'Apr', attendance: 94, cancellations: 4, noShows: 2 },
    { month: 'May', attendance: 96, cancellations: 3, noShows: 1 },
    { month: 'Jun', attendance: 91, cancellations: 6, noShows: 3 },
  ];

  // Calculate averages
  const avgAttendance = data.reduce((acc, curr) => acc + curr.attendance, 0) / data.length;
  const avgCancellations = data.reduce((acc, curr) => acc + curr.cancellations, 0) / data.length;
  const avgNoShows = data.reduce((acc, curr) => acc + curr.noShows, 0) / data.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Report</CardTitle>
          <div className="flex items-center gap-2">
            <Label>View</Label>
            <Select defaultValue="6months">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{avgAttendance.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Average Attendance Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{avgCancellations.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Average Cancellation Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{avgNoShows.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Average No-Show Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Attendance %"
              />
              <Line
                type="monotone"
                dataKey="cancellations"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Cancellations %"
              />
              <Line
                type="monotone"
                dataKey="noShows"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="No-Shows %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
