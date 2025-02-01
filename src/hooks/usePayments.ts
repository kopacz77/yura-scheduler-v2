import { useState } from 'react';
import { toast } from 'sonner';
import { Payment, PaymentStatus } from '@prisma/client';

interface PaymentWithRelations extends Payment {
  lesson: {
    student: {
      user: {
        name: string;
        email: string;
      };
    };
    startTime: Date;
    duration: number;
  };
}

export function usePayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPayment = async (referenceCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referenceCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify payment');
      }

      const { payment } = await response.json();
      toast.success('Payment verified successfully');
      return payment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatusBadgeProps = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          variant: 'success' as const,
          label: 'Paid',
        };
      case 'PENDING':
        return {
          variant: 'warning' as const,
          label: 'Pending',
        };
      case 'FAILED':
        return {
          variant: 'destructive' as const,
          label: 'Failed',
        };
      default:
        return {
          variant: 'secondary' as const,
          label: status,
        };
    }
  };

  const formatReferenceCode = (code: string) => {
    return code.split('-').map(part => part.toUpperCase()).join('-');
  };

  return {
    isLoading,
    error,
    verifyPayment,
    getPaymentStatusBadgeProps,
    formatReferenceCode,
  };
}
