'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ProgressData {
  date: string;
  level: number;
  skills: number;
}

async function fetchProgress(studentId: string) {
  const response = await fetch(`/api/students/${studentId}/progress`);
  if (!response.ok) {
    throw new Error('Failed to fetch progress data');
  }
  return response.json() as Promise<ProgressData[]>;
}

export function ProgressChart() {
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ['progress', session?.user?.id],
    queryFn: () => fetchProgress(session?.user?.id as string),
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle errors outside the query config
  if (error) {
    toast.error('Failed to load progress data');
    console.error('Progress fetch error:', error);
  }

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!data?.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No progress data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="level" 
          stroke="#8884d8" 
          name="Level"
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="skills" 
          stroke="#82ca9d" 
          name="Skills"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
