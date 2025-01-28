import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@prisma/client';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'PAID':
        return 'Paid';
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${getStatusColor()} ${className || ''}`}
    >
      {getStatusText()}
    </Badge>
  );
}
