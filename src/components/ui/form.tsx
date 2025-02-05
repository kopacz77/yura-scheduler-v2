'use client';

import * as React from 'react';
import { Control, useForm, useFormContext, FormProvider, Form as FormComponent } from 'react-hook-form';
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
    field: any;
    fieldState: { error?: { message?: string } };
  }) => React.ReactElement;
};

const FormField = ({ name, control, render }: FormFieldProps) => {
  const { formState } = useFormContext();
  return render({
    field: {
      name,
      value: control._getWatch(name),
      onChange: control._subjects.watch.next,
      onBlur: control._subjects.blur.next,
      ref: control.register(name).ref
    },
    fieldState: {
      error: formState.errors[name]
    },
  });
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

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const formContext = useFormContext();
  if (!formContext) return null;
  
  const { formState } = formContext;
  const error = formState.errors[props.name as string];

  if (!error) return null;

  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {error.message}
    </p>
  );
});
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