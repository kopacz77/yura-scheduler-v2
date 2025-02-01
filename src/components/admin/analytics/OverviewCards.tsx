import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';

interface AnalyticsStat {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

interface OverviewCardsProps {
  stats: {
    totalStudents: number;
    lessonsThisMonth: number;
    monthlyRevenue: number;
    averageSessionLength: number;
    studentGrowth: number;
    lessonGrowth: number;
    revenueGrowth: number;
  };
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const analyticsData: AnalyticsStat[] = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      change: stats.studentGrowth,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: 'Monthly Lessons',
      value: stats.lessonsThisMonth,
      change: stats.lessonGrowth,
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: 'Monthly Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(stats.monthlyRevenue),
      change: stats.revenueGrowth,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      label: 'Avg. Session Length',
      value: `${stats.averageSessionLength} min`,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {analyticsData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {item.change !== undefined && (
              <p className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.change >= 0 ? '+' : ''}{item.change}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
