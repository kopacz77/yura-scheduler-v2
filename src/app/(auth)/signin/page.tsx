import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/SignInForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sign In - YM Movement',
  description: 'Sign in to manage your ice dance lessons',
}

export default function SignInPage() {
  return (
    <div className="flex h-[100vh] items-center justify-center md:bg-slate-100">
      <Card className="w-[90%] max-w-[400px] border-none md:border">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold">YM Movement</CardTitle>
          <CardDescription>Ice Dance with Yura Min</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}
