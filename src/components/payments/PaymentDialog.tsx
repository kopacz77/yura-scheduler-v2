import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

interface PaymentDialogProps {
  appointmentId: string;
  studentName: string;
  amount: number;
  onPaymentUpdate: (data: {
    method: PaymentMethod;
    status: PaymentStatus;
    confirmationId?: string;
    notes?: string;
  }) => void;
}

export function PaymentDialog({ 
  appointmentId, 
  studentName, 
  amount, 
  onPaymentUpdate 
}: PaymentDialogProps) {
  const [method, setMethod] = React.useState<PaymentMethod>('VENMO');
  const [confirmationId, setConfirmationId] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentUpdate({
      method,
      status: 'PENDING',
      confirmationId,
      notes
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Record Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment for {studentName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold">${amount}</div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VENMO">Venmo</SelectItem>
                <SelectItem value="ZELLE">Zelle</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(method === 'VENMO' || method === 'ZELLE') && (
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={confirmationId}
                onChange={(e) => setConfirmationId(e.target.value)}
                placeholder={`Enter ${method.toLowerCase()} transaction ID`}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any payment notes"
            />
          </div>

          <Button type="submit" className="w-full">Record Payment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
