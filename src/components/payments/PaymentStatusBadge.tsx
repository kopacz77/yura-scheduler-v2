'use client';

import { PaymentStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; class: string }> = {
  PENDING: {
    label: 'Pending',
    class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  },
  COMPLETED: {
    label: 'Completed',
    class: 'bg-green-100 text-green-800 hover:bg-green-100/80'
  },
  FAILED: {
    label: 'Failed',
    class: 'bg-red-100 text-red-800 hover:bg-red-100/80'
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
