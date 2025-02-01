'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentInstructionsProps {
  amount: number;
  method: 'VENMO' | 'ZELLE';
  referenceCode: string;
}

export function PaymentInstructions({ amount, method, referenceCode }: PaymentInstructionsProps) {
  const PAYMENT_INFO = {
    VENMO: {
      handle: '@yura-min',
      instructions: 'Open Venmo app and search for:'
    },
    ZELLE: {
      handle: '714-743-7071',
      instructions: 'Open Zelle app and send to:'
    }
  };

  const info = PAYMENT_INFO[method];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium text-lg">${amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Amount to pay</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{info.instructions}</p>
          <div className="flex items-center space-x-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {info.handle}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => copyToClipboard(info.handle, `${method} handle`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Important: Include this reference code in the payment note
          </p>
          <div className="flex items-center space-x-2">
            <code className="relative rounded bg-primary/10 px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary font-semibold">
              {referenceCode}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => copyToClipboard(referenceCode, 'Reference code')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>After sending the payment, Yura will verify it manually in the system.</p>
          <p>This might take a few hours during business hours.</p>
        </div>
      </CardContent>
    </Card>
  );
}
