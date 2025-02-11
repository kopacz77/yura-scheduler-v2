'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/auth/Form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

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

    router.push('/dashboard');
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-2 w-full max-w-md mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Sign In</h1>
      </div>
      <Form form={form} onSubmit={onSubmit}>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            {...form.register('email')}
          />
          <Input
            type="password"
            placeholder="Password"
            {...form.register('password')}
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </div>
      </Form>
    </div>
  );
}