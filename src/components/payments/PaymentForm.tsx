import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const paymentSchema = z.object({
  amount: z.number().min(0),
  method: z.enum(['VENMO', 'ZELLE']),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  defaultAmount?: number;
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
}

export default function PaymentForm({ defaultAmount, onSubmit, onCancel }: PaymentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields... */}
    </form>
  );
}