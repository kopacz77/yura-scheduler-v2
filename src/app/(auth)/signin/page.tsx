'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/auth/Form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Signed in successfully',
    });
  }

  return (
    <div className="flex flex-col space-y-2 w-full max-w-md mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Sign In</h1>
      </div>
      <Form form={form} onSubmit={onSubmit}>
        {/* Form fields */}
      </Form>
    </div>
  );
}