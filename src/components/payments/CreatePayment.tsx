'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreatePaymentFormData {
  lessonId: string;
  amount: number;
  method: 'VENMO' | 'ZELLE';
}

interface Lesson {
  id: string;
  startTime: Date;
  student: {
    user: {
      name: string;
      email: string;
    };
  };
}

interface CreatePaymentProps {
  lessons: Lesson[];
  onSuccess?: () => void;
}

export function CreatePayment({ lessons, onSuccess }: CreatePaymentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreatePaymentFormData>();

  const selectedLessonId = watch('lessonId');
  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  const onSubmit = async (data: CreatePaymentFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment');
      }

      toast.success('Payment created successfully');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lessonId">Select Lesson</Label>
            <Select
              onValueChange={(value) => setValue('lessonId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a lesson" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id}>
                    {lesson.student.user.name} - {new Date(lesson.startTime).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lessonId && (
              <span className="text-sm text-destructive">{errors.lessonId.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', {
                required: 'Amount is required',
                min: {
                  value: 0.01,
                  message: 'Amount must be greater than 0'
                }
              })}
            />
            {errors.amount && (
              <span className="text-sm text-destructive">{errors.amount.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select
              onValueChange={(value) => setValue('method', value as 'VENMO' | 'ZELLE')}
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
              <span className="text-sm text-destructive">{errors.method.message}</span>
            )}
          </div>

          {selectedLesson && (
            <div className="text-sm text-muted-foreground mt-4">
              <p>Student: {selectedLesson.student.user.name}</p>
              <p>Email: {selectedLesson.student.user.email}</p>
              <p>Date: {new Date(selectedLesson.startTime).toLocaleDateString()}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Payment...
              </>
            ) : (
              'Create Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
