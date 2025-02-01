'use client';

import { useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Check } from 'lucide-react';

export function PaymentVerification() {
  const [referenceCode, setReferenceCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const { verifyPayment, isLoading, error, getPaymentStatusBadgeProps, formatReferenceCode } = usePayments();

  const handleSearch = async () => {
    if (!referenceCode.trim()) return;

    const response = await fetch(`/api/payments/search?referenceCode=${referenceCode}`);
    const data = await response.json();
    setSearchResult(data.payment);
  };

  const handleVerify = async () => {
    if (!referenceCode.trim()) return;

    try {
      await verifyPayment(referenceCode);
      setReferenceCode('');
      setSearchResult(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Student Payment</CardTitle>
        <CardDescription>
          After a student sends payment through Venmo/Zelle, verify it here using their reference code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="referenceCode">Payment Reference Code</Label>
            <div className="flex space-x-2">
              <Input
                id="referenceCode"
                placeholder="e.g., JOHN-JAN15-1000"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button
                variant="secondary"
                onClick={handleSearch}
                disabled={!referenceCode.trim() || isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          {searchResult && (
            <Card className="bg-muted">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{searchResult.student.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{searchResult.student.user.email}</p>
                  </div>
                  <Badge variant={getPaymentStatusBadgeProps(searchResult.status).variant}>
                    {getPaymentStatusBadgeProps(searchResult.status).label}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <p><strong>Amount:</strong> ${searchResult.amount.toFixed(2)}</p>
                  <p><strong>Method:</strong> {searchResult.method}</p>
                  <p><strong>Lesson Date:</strong> {new Date(searchResult.lesson.startTime).toLocaleDateString()}</p>
                </div>

                {searchResult.status === 'PENDING' && (
                  <Button
                    onClick={handleVerify}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Steps to verify payment:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Check your Venmo/Zelle for the payment</li>
              <li>Verify the reference code matches</li>
              <li>Confirm the amount is correct</li>
              <li>Click "Mark as Paid" to update the system</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
