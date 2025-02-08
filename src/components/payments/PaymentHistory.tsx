'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Payment } from '@prisma/client';
import { PaymentStatusBadge } from './PaymentStatusBadge';

interface PaymentHistoryProps {
  open: boolean;
  onClose: () => void;
  payments: Payment[];
  studentName: string;
}

export function PaymentHistory({
  open,
  onClose,
  payments,
  studentName,
}: PaymentHistoryProps) {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>
            Payment history for {studentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-2 bg-muted rounded">
            <span className="font-medium">Total Paid</span>
            <span className="font-medium">{formatCurrency(totalPaid)}</span>
          </div>

          <ScrollArea className="h-[300px] rounded border p-4">
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-start border-b pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(payment.createdAt, 'PPP')}
                    </div>
                    {payment.notes && (
                      <div className="text-sm text-muted-foreground">
                        {payment.notes}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-right">
                    <PaymentStatusBadge status={payment.status} />
                    <div className="text-sm text-muted-foreground">
                      via {payment.method}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
