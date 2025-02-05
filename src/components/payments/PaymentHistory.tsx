import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { usePayments } from '@/hooks/usePayments';

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
              {format(new Date(payment.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <Badge
              variant={
                payment.status === 'COMPLETED' ? 'default' :
                payment.status === 'PENDING' ? 'secondary' : 'destructive'
              }
            >
              {payment.status.toLowerCase()}
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