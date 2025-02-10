'use client';

import { FormProvider, UseFormReturn } from 'react-hook-form';

interface FormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}

export function Form({ form, onSubmit, children }: FormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}