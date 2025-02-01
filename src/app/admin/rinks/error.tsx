'use client';

import { Error } from '@/components/ui/error';

export default function RinksError() {
  return (
    <Error
      title="Failed to load rinks"
      message="There was an error loading the rinks data. Please try again later."
    />
  );
}
