import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}