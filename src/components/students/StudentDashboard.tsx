'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingLessons } from '@/components/schedule/UpcomingLessons';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { ProgressChart } from '@/components/students/ProgressChart';
import { Button } from '@/components/ui/button';
import { CalendarClock, DollarSign, LineChart } from 'lucide-react';
import { toast } from 'sonner';
import { Payment } from '@prisma/client';

async function fetchPayments(studentId: string) {
  const response = await fetch(`/api/payments?studentId=${studentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }
  return response.json() as Promise<Payment[]>;
}

export function StudentDashboard() {
  const { data: session } = useSession();
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);

  const { data: payments, isLoading: isLoadingPayments, error } = useQuery({
    queryKey: ['payments', session?.user?.id],
    queryFn: () => fetchPayments(session?.user?.id as string),
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle errors outside the query config
  if (error) {
    toast.error('Failed to load payment history');
    console.error('Payment fetch error:', error);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingLessons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            My Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline"
              onClick={() => setIsPaymentHistoryOpen(true)}
              className="w-full"
              disabled={isLoadingPayments}
            >
              {isLoadingPayments ? 'Loading...' : 'View Payment History'}
            </Button>
          </div>
          
          {session?.user?.name && payments && (
            <PaymentHistory 
              open={isPaymentHistoryOpen}
              onClose={() => setIsPaymentHistoryOpen(false)}
              payments={payments}
              studentName={session.user.name}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
