'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PaymentMethod } from '@prisma/client';

const paymentSchema = z.object({
  amount: z.string().transform(Number).pipe(
    z.number().positive('Amount must be positive')
  ),
  method: z.nativeEnum(PaymentMethod),
  referenceCode: z.string().min(1, 'Reference code is required'),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  lessonId: string;
  defaultAmount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({ lessonId, defaultAmount, onSuccess, onCancel }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount?.toString() || '',
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lessonId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>
            Record payment details for the lesson
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                type="number"
                id="amount"
                step="0.01"
                className="pl-7"
                {...register('amount')}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select
              onValueChange={(value) => setValue('method', value as PaymentMethod)}
              {...register('method')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VENMO">Venmo</SelectItem>
                <SelectItem value="ZELLE">Zelle</SelectItem>
              </SelectContent>
            </Select>
            {errors.method && (
              <p className="text-sm text-red-500">{errors.method.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceCode">Reference Code</Label>
            <Input
              id="referenceCode"
              {...register('referenceCode')}
            />
            {errors.referenceCode && (
              <p className="text-sm text-red-500">{errors.referenceCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Process Payment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
