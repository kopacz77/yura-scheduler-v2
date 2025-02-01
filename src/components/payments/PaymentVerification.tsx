'use client';

import { useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function PaymentVerification() {
  const [referenceCode, setReferenceCode] = useState('');
  const { verifyPayment, isLoading, error, getPaymentStatusBadgeProps, formatReferenceCode } = usePayments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode.trim()) return;

    try {
      await verifyPayment(referenceCode);
      setReferenceCode('');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Payment</CardTitle>
        <CardDescription>
          Enter the payment reference code to verify a student's payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referenceCode">Reference Code</Label>
            <Input
              id="referenceCode"
              placeholder="e.g., JOHN-JAN15-1000"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              className="uppercase"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !referenceCode.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
