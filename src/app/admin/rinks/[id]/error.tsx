'use client';

import { Error } from '@/components/ui/error';

export default function RinkScheduleError() {
  return (
    <Error
      title="Failed to load rink schedule"
      message="There was an error loading the rink schedule data. Please try again later."
    />
  );
}
