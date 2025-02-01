'use client';

import { Payment, PaymentStatus as PaymentStatusType } from '@prisma/client';
import { usePayments } from '@/hooks/usePayments';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PaymentStatusProps {
  payment: Payment & {
    verifiedAt?: Date | null;
    verifiedBy?: string | null;
  };
}

export function PaymentStatus({ payment }: PaymentStatusProps) {
  const { getPaymentStatusBadgeProps, formatReferenceCode } = usePayments();

  const copyReferenceCode = async () => {
    await navigator.clipboard.writeText(payment.referenceCode);
    toast.success('Reference code copied to clipboard');
  };

  const badgeProps = getPaymentStatusBadgeProps(payment.status);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={badgeProps.variant}>{badgeProps.label}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            ${payment.amount.toFixed(2)}
          </span>
          <Badge variant="outline">{payment.method}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium">Reference Code</div>
          <div className="flex items-center space-x-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {formatReferenceCode(payment.referenceCode)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={copyReferenceCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {payment.status === 'COMPLETED' && payment.verifiedAt && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Verified by {payment.verifiedBy} on{' '}
            {format(new Date(payment.verifiedAt), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
      )}
    </div>
  );
}
