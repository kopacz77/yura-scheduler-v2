'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSession } from 'next-auth/react';

interface PaymentSummaryData {
  date: string;
  amount: number;
  count: number;
}

export function PaymentSummary() {
  const { data: session } = useSession();
  const [summaryData, setSummaryData] = useState<PaymentSummaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/payments/summary');
        if (!response.ok) throw new Error('Failed to fetch payment summary');
        const data = await response.json();
        
        setSummaryData(data.dailyData);
        setTotalRevenue(data.totalRevenue);
        setTotalPayments(data.totalPayments);
      } catch (err) {
        console.error('Error fetching payment summary:', err);
        setError('Failed to load payment summary');
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user.role === 'ADMIN') {
      fetchSummary();
    }
  }, [session]);

  if (session?.user.role !== 'ADMIN') {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-secondary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Payments</p>
            <p className="text-2xl font-bold">{totalPayments}</p>
          </div>
        </div>

        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
