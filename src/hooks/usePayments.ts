import { useState, useCallback } from 'react';

interface PaymentData {
  amount: number;
  method: 'card' | 'cash' | 'transfer';
  notes?: string;
}

export function usePayments() {
  const [isLoading, setIsLoading] = useState(false);

  const recordPayment = useCallback(async (appointmentId: string, data: PaymentData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, ...data })
      });

      if (!response.ok) throw new Error('Payment failed');
      return await response.json();
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPaymentHistory = useCallback(async (studentId: string) => {
    try {
      const response = await fetch(`/api/payments/history/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch payment history');
      return await response.json();
    } catch (error) {
      console.error('Payment history error:', error);
      throw error;
    }
  }, []);

  return {
    recordPayment,
    getPaymentHistory,
    isLoading
  };
}