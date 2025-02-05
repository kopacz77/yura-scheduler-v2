'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { PaymentStatus } from '@prisma/client';

type Payment = {
  id: string;
  lessonId: string;
  amount: number;
  status: PaymentStatus;
  method: 'VENMO' | 'ZELLE';
  referenceCode: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
};

type PaymentFilters = {
  status?: string;
  startDate?: Date;
  endDate?: Date;
};

type BadgeProps = {
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  label: string;
};

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (filters: PaymentFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payments');

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const verifyPayment = async (paymentId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to verify payment');

      const updatedPayment = await response.json();
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId ? updatedPayment : payment
        )
      );

      toast({
        title: 'Success',
        description: 'Payment verified successfully',
      });

      return updatedPayment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const markPaymentFailed = async (paymentId: string, reason: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'FAILED',
          notes: reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to mark payment as failed');

      const updatedPayment = await response.json();
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId ? updatedPayment : payment
        )
      );

      toast({
        title: 'Success',
        description: 'Payment marked as failed',
      });

      return updatedPayment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update payment';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getPaymentStatusBadgeProps = (status: PaymentStatus): BadgeProps => {
    switch (status) {
      case 'COMPLETED':
        return { variant: 'success', label: 'Completed' };
      case 'PENDING':
        return { variant: 'warning', label: 'Pending' };
      case 'FAILED':
        return { variant: 'destructive', label: 'Failed' };
      default:
        return { variant: 'secondary', label: status };
    }
  };

  const formatReferenceCode = (code: string): string => {
    // Format code into groups of 4 characters
    return code.match(/.{1,4}/g)?.join('-') || code;
  };

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    verifyPayment,
    markPaymentFailed,
    getPaymentStatusBadgeProps,
    formatReferenceCode,
  };
}