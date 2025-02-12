'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import * as z from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof formSchema>

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  // Let the server handle role-based redirect
  const callbackUrl = searchParams?.get('callbackUrl')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true, // Let NextAuth handle the redirect
        callbackUrl: callbackUrl || '/admin/dashboard', // Default to admin dashboard
      })

      // This code won't run if redirect is true
      if (res?.error) {
        form.setError('root', { message: 'Invalid email or password' })
      }
    } catch (error) {
      console.error('Sign in error:', error)
      form.setError('root', { message: 'An error occurred during sign in' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white"
                  autoComplete="email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link 
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  className="bg-white"
                  autoComplete="current-password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
    </Form>
  );
}