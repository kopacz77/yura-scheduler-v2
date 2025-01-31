import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
  isLoading?: boolean;
}

interface PaymentFormData {
  amount: number;
  method: 'card' | 'cash' | 'transfer';
  notes?: string;
}

export function PaymentForm({ onSubmit, initialData, isLoading }: PaymentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', { required: true, min: 0 })}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">Valid amount is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select {...register('method', { required: true })}>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="transfer">Bank Transfer</option>
        </Select>
        {errors.method && (
          <p className="text-xs text-destructive">Payment method is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" {...register('notes')} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Processing...' : 'Submit Payment'}
      </Button>
    </form>
  );
}