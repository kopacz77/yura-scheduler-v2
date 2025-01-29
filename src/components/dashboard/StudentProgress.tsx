import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function StudentProgress() {
  // This will be replaced with real data from the API
  const progressData = [
    { month: 'Jan', beginners: 5, intermediate: 8, advanced: 3, competitive: 1 },
    { month: 'Feb', beginners: 4, intermediate: 9, advanced: 3, competitive: 1 },
    { month: 'Mar', beginners: 3, intermediate: 9, advanced: 4, competitive: 2 },
    { month: 'Apr', beginners: 2, intermediate: 8, advanced: 5, competitive: 2 },
    { month: 'May', beginners: 2, intermediate: 7, advanced: 6, competitive: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="beginners" 
                stroke="#22c55e"
                name="Beginners"
              />
              <Line 
                type="monotone" 
                dataKey="intermediate" 
                stroke="#3b82f6"
                name="Intermediate"
              />
              <Line 
                type="monotone" 
                dataKey="advanced" 
                stroke="#a855f7"
                name="Advanced"
              />
              <Line 
                type="monotone" 
                dataKey="competitive" 
                stroke="#ef4444"
                name="Competitive"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
