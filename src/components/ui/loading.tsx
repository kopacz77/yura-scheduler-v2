import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
