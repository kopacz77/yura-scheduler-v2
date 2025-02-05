'use client';

import * as React from 'react';
import { Control, UseFormReturn, useForm, useFormContext, useController, FormProvider } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormProps<T extends Record<string, any>> = {
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

const Form = <T extends Record<string, any>>({ form, onSubmit, children, className, ...props }: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};
Form.displayName = 'Form';

type FormFieldProps = {
  name: string;
  control: Control<any>;
  render: (props: {
    field: ReturnType<typeof useController>['field'];
    fieldState: { error?: { message?: string } };
  }) => React.ReactElement;
};

const FormField = ({ name, control, render }: FormFieldProps) => {
  const { field, fieldState } = useController({
    name,
    control,
  });

  return render({ field, fieldState });
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn('text-sm font-medium', className)}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative', className)}
    {...props}
  />
));
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[0.8rem] text-muted-foreground', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  name?: string;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, name, ...props }, ref) => {
    const formContext = useFormContext();
    if (!formContext) return null;
    
    const { formState } = formContext;
    const error = name ? formState.errors[name] : null;

    if (!error) return null;

    return (
      <p
        ref={ref}
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {error.message as string}
      </p>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};