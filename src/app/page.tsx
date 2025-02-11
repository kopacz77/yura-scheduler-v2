import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">YM Movement</h1>
      <div className="space-y-4">
        <Link 
          href="/signin" 
          className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}