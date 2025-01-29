import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Beginner', value: 8, color: '#22c55e' },
  { name: 'Intermediate', value: 10, color: '#3b82f6' },
  { name: 'Advanced', value: 4, color: '#a855f7' },
  { name: 'Competitive', value: 2, color: '#ef4444' },
];

export function StudentOverview() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Student Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              formatter={(value) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
