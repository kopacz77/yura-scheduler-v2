import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePayments } from '@/hooks/usePayments';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface PaymentHistoryProps {
  studentId?: string;  // Optional: if not provided, uses current user's student ID
}

export function PaymentHistory({ studentId }: PaymentHistoryProps) {
  const { payments = [], isLoading } = usePayments(studentId);

  if (isLoading) {
    return <div>Loading payments...</div>;
  }

  if (!payments.length) {
    return <div className="text-center text-muted-foreground py-8">No payment history found</div>;
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div>
            <p className="font-medium">
              ${payment.amount.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(payment.date), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant={
                payment.status === 'completed' ? 'default' :
                payment.status === 'pending' ? 'secondary' : 'destructive'
              }
            >
              {payment.status}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {payment.method}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}