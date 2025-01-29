'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

type Permission = {
  id: string;
  name: string;
  description: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
};

const permissions: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Create, update, and delete users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify roles' },
  { id: 'manage_students', name: 'Manage Students', description: 'Manage student profiles and progress' },
  { id: 'manage_schedule', name: 'Manage Schedule', description: 'Create and modify lesson schedules' },
  { id: 'manage_payments', name: 'Manage Payments', description: 'Process and track payments' },
  { id: 'view_reports', name: 'View Reports', description: 'Access analytics and reports' },
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full system access',
      permissions: permissions.map(p => p.id),
      isSystem: true,
    },
    {
      id: 'coach',
      name: 'Coach',
      description: 'Manage students and schedule',
      permissions: ['manage_students', 'manage_schedule', 'view_reports'],
      isSystem: true,
    },
  ]);

  const handleAddRole = (newRole: Omit<Role, 'id'>) => {
    const role: Role = {
      ...newRole,
      id: `${Date.now()}`,
    };
    setRoles([...roles, role]);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleTogglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id !== roleId) return role;
      
      const permissions = role.permissions.includes(permissionId)
        ? role.permissions.filter(id => id !== permissionId)
        : [...role.permissions, permissionId];
      
      return { ...role, permissions };
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Role Management</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddRole({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  permissions: [],
                });
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" required />
                </div>
                <Button type="submit" className="w-full">Add Role</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              {permissions.map(permission => (
                <TableHead key={permission.id} className="text-center">
                  {permission.name}
                </TableHead>
              ))}
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                {permissions.map(permission => (
                  <TableCell key={permission.id} className="text-center">
                    <Checkbox
                      checked={role.permissions.includes(permission.id)}
                      onCheckedChange={() => handleTogglePermission(role.id, permission.id)}
                      disabled={role.isSystem}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  {!role.isSystem && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
