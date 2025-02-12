import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white p-12">
          <h1 className="text-5xl font-bold mb-6">Welcome to Yura's Ice Dance</h1>
          <p className="text-xl mb-8">
            Schedule your ice dance lessons with Olympic ice dancer Yura Min
          </p>
          <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/skating.jpg" // We'll need to add this image
            alt="Ice Dancing"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}