'use client';

import { useState, useEffect } from 'react';
import { PaymentsList, PaymentWithDetails } from '@/components/payments/PaymentsList';
import { PaymentVerification } from '@/components/payments/PaymentVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, DollarSign, CreditCard } from 'lucide-react';
import { Payment } from '@prisma/client';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data.payments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-lg font-medium">Error loading payments</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <DollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Payments</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pending
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `$${payments
                  .filter(p => p.status === 'PENDING')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)}`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Payments</TabsTrigger>
          <TabsTrigger value="verify">Verify Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <PaymentsList payments={payments} />
          )}
        </TabsContent>

        <TabsContent value="verify">
          <div className="max-w-md">
            <PaymentVerification />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}