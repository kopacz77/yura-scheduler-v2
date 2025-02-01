'use client';

import { Error } from '@/components/ui/error';

export default function StudentProfileError() {
  return (
    <Error
      title="Failed to load student profile"
      message="There was an error loading the student profile. Please try again later."
    />
  );
}
