import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { format } from 'date-fns';

interface PaymentUpdateData {
  id: string;
  status: PaymentStatus;
  notes?: string;
  confirmationId?: string;
}

export function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [updateData, setUpdateData] = useState<PaymentUpdateData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive'
      });
    }
  };

  const handleUpdatePayment = async () => {
    if (!updateData) return;

    try {
      const response = await fetch(`/api/payments/${updateData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update payment');

      const updatedPayment = await response.json();
      setPayments(prev =>
        prev.map(payment =>
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      );

      setIsUpdateDialogOpen(false);
      setSelectedPayment(null);
      setUpdateData(null);

      toast({
        title: 'Success',
        description: 'Payment updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sendPaymentReminder = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/remind`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to send reminder');

      toast({
        title: 'Success',
        description: 'Payment reminder sent successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send payment reminder',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment Management</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {payments.map((payment: any) => (
          <Card key={payment.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {payment.student.name} - {format(new Date(payment.appointment.start), 'PPp')}
                </h3>
                <p className="text-sm text-gray-600">
                  Amount: ${payment.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Method: {payment.method}
                </p>
                {payment.confirmationId && (
                  <p className="text-sm text-gray-600">
                    Confirmation: {payment.confirmationId}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setUpdateData({
                        id: payment.id,
                        status: payment.status,
                        notes: payment.notes,
                        confirmationId: payment.confirmationId
                      });
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    Update
                  </Button>
                  {payment.status === 'PENDING' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => sendPaymentReminder(payment.id)}
                    >
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={updateData?.status}
                onValueChange={(value: PaymentStatus) =>
                  setUpdateData(prev => prev ? { ...prev, status: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Confirmation ID</Label>
              <Input
                value={updateData?.confirmationId || ''}
                onChange={(e) =>
                  setUpdateData(prev =>
                    prev ? { ...prev, confirmationId: e.target.value } : null
                  )
                }
                placeholder="Enter confirmation ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={updateData?.notes || ''}
                onChange={(e) =>
                  setUpdateData(prev =>
                    prev ? { ...prev, notes: e.target.value } : null
                  )
                }
                placeholder="Add payment notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleUpdatePayment}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
