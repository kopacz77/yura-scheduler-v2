import { useState } from 'react';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

interface PaymentData {
  method: PaymentMethod;
  status: PaymentStatus;
  confirmationId?: string;
  notes?: string;
}

export function usePayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordPayment = async (appointmentId: string, data: PaymentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const payment = await response.json();
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: paymentId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const payment = await response.json();
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recordPayment,
    updatePaymentStatus,
    isLoading,
    error,
  };
}
