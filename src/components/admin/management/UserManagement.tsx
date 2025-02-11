'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import * as z from 'zod';

const userManagementSchema = z.object({
  isActive: z.boolean(),
  isAdmin: z.boolean(),
  isCoach: z.boolean(),
});

type FormData = z.infer<typeof userManagementSchema>;

interface UserManagementFormProps {
  id: string;
  onSubmit: (data: FormData) => Promise<void>;
  defaultValues?: Partial<FormData>;
}

export function UserManagementForm({ id, onSubmit, defaultValues }: UserManagementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      isActive: defaultValues?.isActive ?? true,
      isAdmin: defaultValues?.isAdmin ?? false,
      isCoach: defaultValues?.isCoach ?? false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch checked={value} onCheckedChange={onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Admin Access</FormLabel>
              <FormControl>
                <Switch checked={value} onCheckedChange={onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isCoach"
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Coach Access</FormLabel>
              <FormControl>
                <Switch checked={value} onCheckedChange={onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}