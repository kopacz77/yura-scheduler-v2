import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign In - YM Movement',
  description: 'Sign in to your YM Movement account',
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/logo.png"
            alt="YM Movement Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight">YM Movement</h1>
          <p className="text-lg">Welcome Back</p>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your ice dance lessons
          </p>
        </div>
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          New student?{' '}
          <Link href="/signup" className="underline hover:text-brand">
            Sign up for lessons
          </Link>
        </p>
      </div>
    </div>
  )
}
