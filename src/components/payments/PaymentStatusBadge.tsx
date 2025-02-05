'use client';

import { cn } from '@/lib/utils';
import { PaymentStatus } from '@prisma/client';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'FAILED':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 text-xs font-medium rounded-full',
      getStatusColor(),
      className
    )}>
      {status}
    </span>
  );
}