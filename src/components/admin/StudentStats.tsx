'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        {description}
        {trend && (
          <span className={`ml-2 ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

export function StudentStats() {
  return (
    <div className="grid gap-4">
      <StatsCard
        title="Total Students"
        value="42"
        description="Active students"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 12, label: 'vs last month' }}
      />
      <StatsCard
        title="Lessons This Week"
        value="28"
        description="Scheduled lessons"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatsCard
        title="Attention Needed"
        value="3"
        description="Students requiring follow-up"
        icon={<AlertCircle className="h-5 w-5" />}
      />
    </div>
  );
}