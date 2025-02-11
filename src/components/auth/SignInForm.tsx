'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { Icons } from '@/components/icons'

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await signIn('google', {
        callbackUrl,
      })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Button 
            variant="outline" 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <LoadingSpinner className="mr-2 h-4 w-4" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Secure Authentication
          </span>
        </div>
      </div>
    </div>
  )
}
