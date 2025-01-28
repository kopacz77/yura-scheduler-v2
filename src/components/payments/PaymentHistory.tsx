import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Button } from '@/components/ui/button';
import { Payment } from '@prisma/client';
import { usePayments } from '@/hooks/usePayments';

interface PaymentHistoryProps {
  payments: Payment[];
  onPaymentUpdated?: () => void;
}

export function PaymentHistory({ payments, onPaymentUpdated }: PaymentHistoryProps) {
  const { updatePaymentStatus, isLoading } = usePayments();

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      await updatePaymentStatus(paymentId, 'CONFIRMED');
      onPaymentUpdated?.();
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confirmation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                  {payment.method.charAt(0) + payment.method.slice(1).toLowerCase()}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell>
                  {payment.confirmationId || '-'}
                </TableCell>
                <TableCell>
                  {payment.status === 'PAID' && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleConfirmPayment(payment.id)}
                    >
                      Confirm Receipt
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No payment history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
