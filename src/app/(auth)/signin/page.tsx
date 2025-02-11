import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/SignInForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In - YM Movement',
  description: 'Sign in to manage your ice dance lessons',
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Logo size="small" />
        <span className="text-xl font-semibold">YM Movement</span>
      </Link>
      
      <Card className="w-full max-w-[400px] border-none shadow-md md:border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to manage your ice dance lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link 
              href="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
