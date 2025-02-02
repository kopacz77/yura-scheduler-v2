'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

type Payment = {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  method: 'VENMO' | 'ZELLE';
  lessonId: string;
  studentId: string;
  referenceCode: string;
  createdAt: Date;
};

type PaymentFilters = {
  studentId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
};

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (filters: PaymentFilters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payments');

      const data = await response.json();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: 'Failed to fetch payments. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId: string, verificationNotes?: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          verificationNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to verify payment');

      const data = await response.json();
      setPayments(prev =>
        prev.map(payment =>
          payment.id === paymentId ? data : payment
        )
      );

      toast({
        title: 'Success',
        description: 'Payment verified successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to verify payment. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'referenceCode' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error('Failed to create payment');

      const data = await response.json();
      setPayments(prev => [...prev, data]);

      toast({
        title: 'Success',
        description: 'Payment created successfully.',
      });

      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create payment. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    fetchPayments,
    verifyPayment,
    createPayment,
  };
}