'use client';

import { useState } from 'react';
import { PaymentStatus } from './PaymentStatus';
import { PaymentVerification } from './PaymentVerification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentStatus as PaymentStatusType, PaymentMethod } from '@prisma/client';
import { format } from 'date-fns';

export interface PaymentWithDetails {
  id: string;
  studentId: string;
  lessonId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatusType;
  referenceCode: string;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  reminderSentAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
  lesson: {
    startTime: Date;
    endTime: Date;
    duration: number;
    type: string;
  };
}

interface PaymentsListProps {
  payments: PaymentWithDetails[];
}

export function PaymentsList({ payments }: PaymentsListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusType | 'ALL'>('ALL');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (
      (payment.student?.user.name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      payment.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      payment.student?.user.email.toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          placeholder="Search by name, email, or reference code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as PaymentStatusType | 'ALL')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPayments.map(payment => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{payment.student?.user.name || 'Unnamed Student'}</CardTitle>
                  <div className="text-sm text-muted-foreground">{payment.student?.user.email}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.lesson && (
                  <div className="text-sm text-muted-foreground">
                    <div>Lesson Date: {format(payment.lesson.startTime, 'MMM d, yyyy')}</div>
                    <div>Time: {format(payment.lesson.startTime, 'h:mm a')} - {format(payment.lesson.endTime, 'h:mm a')}</div>
                    <div>Duration: {payment.lesson.duration} minutes</div>
                    <div>Type: {payment.lesson.type}</div>
                  </div>
                )}
                <PaymentStatus payment={payment} />
                {payment.notes && (
                  <div className="text-sm mt-2 text-muted-foreground">
                    <div className="font-medium">Notes:</div>
                    <div>{payment.notes}</div>
                  </div>
                )}
                {payment.reminderSentAt && (
                  <div className="text-sm mt-2 text-muted-foreground">
                    <div>Reminder sent: {format(payment.reminderSentAt, 'MMM d, yyyy h:mm a')}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No payments found matching your criteria
        </div>
      )}
    </div>
  );
}