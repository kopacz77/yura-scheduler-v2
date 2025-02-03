'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn('space-y-6', className)}
    {...props}
  />
));
Form.displayName = 'Form';

type FormFieldContextValue<
  TFieldValues extends Record<string, any> = Record<string, any>
> = {
  name: string;
  id: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends Record<string, any> = Record<string, any>
>(
  props: {
    name: string;
    id?: string;
    render: (
      fieldProps: {
        field: {
          onChange: (...event: any[]) => void;
          onBlur: () => void;
          value: any;
          name: string;
          ref: (instance: any) => void;
        };
        fieldState: {
          error?: {
            message?: string;
          };
        };
      }
    ) => React.ReactElement;
  }
) => {
  const { render, name, id = name } = props;
  const { register, formState } = useFormContext();

  const fieldState = formState[name];

  return (
    <FormFieldContext.Provider value={{ name, id }}>
      {render({
        field: {
          ...register(name),
          id,
        },
        fieldState,
      })}
    </FormFieldContext.Provider>
  );
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
  const { name } = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const error = name ? formState.errors[name] : undefined;

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