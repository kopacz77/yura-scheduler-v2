import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type Permission = 
  | 'manage:rinks'
  | 'manage:students'
  | 'manage:lessons'
  | 'manage:payments'
  | 'view:reports'
  | 'book:lessons'
  | 'view:schedule';

const rolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    'manage:rinks',
    'manage:students',
    'manage:lessons',
    'manage:payments',
    'view:reports',
    'view:schedule',
  ],
  COACH: [
    'manage:lessons',
    'view:reports',
    'view:schedule',
  ],
  STUDENT: [
    'book:lessons',
    'view:schedule',
  ],
};

export async function checkPermission(permission: Permission): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const userRole = session.user.role;
  return rolePermissions[userRole]?.includes(permission) || false;
}

export async function hasAnyPermission(permissions: Permission[]): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const userRole = session.user.role;
  return permissions.some(permission =>
    rolePermissions[userRole]?.includes(permission)
  );
}

export async function hasAllPermissions(permissions: Permission[]): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) return false;

  const userRole = session.user.role;
  return permissions.every(permission =>
    rolePermissions[userRole]?.includes(permission)
  );
}