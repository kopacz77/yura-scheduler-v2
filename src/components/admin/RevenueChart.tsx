'use client';

import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

type RevenueData = {
  period: string;
  amount: number;
  target?: number;
}[];

type RevenueChartProps = {
  data: RevenueData;
};

export function RevenueChart({ data }: RevenueChartProps) {
  const { theme } = useTheme();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
          />
          <XAxis
            dataKey="period"
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <YAxis
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
          />
          <Bar
            dataKey="amount"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
          />
          {data.some(d => d.target) && (
            <Bar
              dataKey="target"
              fill="#DC2626"
              radius={[4, 4, 0, 0]}
              opacity={0.5}
            />
          )}
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}