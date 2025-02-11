import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Logo size="small" />
        <span className="text-xl font-semibold">YM Movement</span>
      </Link>

      <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-md">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Authentication Error</h1>
        <p className="mb-6 text-slate-600">
          There was a problem signing you in. Please check your credentials and try again.
        </p>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/signin">Try Again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
