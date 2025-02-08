'use client';

import { PaymentStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  },
  PAID: {
    label: 'Paid',
    class: 'bg-green-100 text-green-800 hover:bg-green-100/80'
  },
  OVERDUE: {
    label: 'Overdue',
    class: 'bg-red-100 text-red-800 hover:bg-red-100/80'
  },
  REFUNDED: {
    label: 'Refunded',
    class: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  },
  PARTIAL: {
    label: 'Partial',
    class: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
  }
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={cn(
        'text-xs font-normal',
        config.class,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
