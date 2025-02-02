'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

type PaymentRecord = {
  id: string;
  studentName: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'Venmo' | 'Zelle';
  lessonType: string;
};

export function PaymentReport() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Replace with actual API call
        const mockData: PaymentRecord[] = [
          {
            id: '1',
            studentName: 'John Doe',
            date: '2024-02-01',
            amount: 75.00,
            status: 'completed',
            method: 'Venmo',
            lessonType: 'Private Lesson'
          },
          {
            id: '2',
            studentName: 'Jane Smith',
            date: '2024-02-02',
            amount: 85.00,
            status: 'pending',
            method: 'Zelle',
            lessonType: 'Group Session'
          },
          {
            id: '3',
            studentName: 'Mike Johnson',
            date: '2024-02-03',
            amount: 65.00,
            status: 'completed',
            method: 'Venmo',
            lessonType: 'Private Lesson'
          },
        ];
        
        setPayments(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch payment records:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleExport = async () => {
    const headers = ['Student Name', 'Date', 'Amount', 'Status', 'Method', 'Lesson Type'];
    const csvData = payments.map(payment => [
      payment.studentName,
      payment.date,
      payment.amount.toFixed(2),
      payment.status,
      payment.method,
      payment.lessonType
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Records</CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Lesson Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.studentName}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.lessonType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}