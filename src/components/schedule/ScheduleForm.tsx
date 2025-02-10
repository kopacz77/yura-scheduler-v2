'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

interface RinkDetails {
  address: string;
  name: string;
  timezone: string;
}

const formSchema = z.object({
  rink: z.string().min(1, 'Please select a rink'),
  weekday: z.string().min(1, 'Please select a day'),
  time: z.string().min(1, 'Please select a time'),
  duration: z.number().min(15, 'Minimum duration is 15 minutes'),
  maxStudents: z.number().min(1, 'At least 1 student required'),
});

export function ScheduleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxStudents: 1,
      duration: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/slots/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create recurring slot');
      }

      toast({
        title: 'Success',
        description: 'Recurring slot created successfully',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recurring slot',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        // Form fields here
      </form>
    </Form>
  );
}