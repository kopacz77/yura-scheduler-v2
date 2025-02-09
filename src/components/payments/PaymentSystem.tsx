'use client';

import { useState } from 'react';
import { PaymentMethod } from '@prisma/client';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentSystemProps {
  amount: number;
  onSubmit: (data: { method: PaymentMethod; referenceCode: string }) => Promise<void>;
}

export function PaymentSystem({ amount, onSubmit }: PaymentSystemProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.VENMO);
  const [referenceCode, setReferenceCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode) {
      toast.error('Please enter a reference code');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ method, referenceCode });
      toast.success('Payment reference submitted');
      setReferenceCode('');
    } catch (error) {
      toast.error('Failed to submit payment reference');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Amount due: ${amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup
              defaultValue={PaymentMethod.VENMO}
              onValueChange={(value) => setMethod(value as PaymentMethod)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={PaymentMethod.VENMO} id="venmo" />
                <Label htmlFor="venmo">Venmo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={PaymentMethod.ZELLE} id="zelle" />
                <Label htmlFor="zelle">Zelle</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceCode">Reference Code</Label>
            <Input
              id="referenceCode"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="Enter payment reference code"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !referenceCode}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Payment Reference'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
