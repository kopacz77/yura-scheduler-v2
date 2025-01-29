'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

type PendingUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  student: {
    level: string;
    phone: string;
    emergencyName: string;
    emergencyPhone: string;
    relationship: string;
  };
};

export function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch('/api/admin/pending-users');
      if (!response.ok) throw new Error('Failed to fetch pending users');
      const data = await response.json();
      setPendingUsers(data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to load pending approvals');
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/approve-user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve user');
      
      toast.success('User approved successfully');
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reject-user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reject user');
      
      toast.success('User rejected');
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Approvals</CardTitle>
          <Badge variant="secondary">{pendingUsers.length} Pending</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.student.level}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pendingUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No pending approvals
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Student Registration Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedUser.student.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="font-medium">{selectedUser.student.level}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <h3 className="font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedUser.student.emergencyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedUser.student.emergencyPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium">{selectedUser.student.relationship}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedUser.id)}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedUser.id)}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
