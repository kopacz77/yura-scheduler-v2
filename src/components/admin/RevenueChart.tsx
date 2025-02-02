'use client';

import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '@/components/ui/loading-states';
import { useState, useEffect } from 'react';

type RevenueData = {
  month: string;
  revenue: number;
  target: number;
};

export function RevenueChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch
    const fetchData = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          { month: 'Jan', revenue: 4000, target: 3000 },
          { month: 'Feb', revenue: 3000, target: 3000 },
          { month: 'Mar', revenue: 5000, target: 3000 },
          { month: 'Apr', revenue: 2780, target: 3000 },
          { month: 'May', revenue: 4890, target: 3000 },
          { month: 'Jun', revenue: 3390, target: 3000 },
        ];
        setData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ChartSkeleton />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis 
            dataKey="month" 
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <YAxis 
            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#2563EB" 
            activeDot={{ r: 8 }}
            name="Revenue"
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#DC2626" 
            strokeDasharray="5 5" 
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}