'use client';

import { Error } from '@/components/ui/error';

export default function StudentsError() {
  return (
    <Error
      title="Failed to load students"
      message="There was an error loading the student list. Please try again later."
    />
  );
}
