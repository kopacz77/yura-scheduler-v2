'use client';

import { Error } from '@/components/ui/error';

export default function AnalyticsError() {
  return (
    <Error
      title="Failed to load analytics"
      message="There was an error loading the analytics data. Please try again later."
    />
  );
}
