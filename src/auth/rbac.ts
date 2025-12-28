// Imports au DÉBUT du fichier
import React, { useCallback, useMemo } from 'react';

// Role-Based Access Control (RBAC) System
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'manage';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  inherits?: string[];
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  customPermissions?: string[];
}

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  {
    id: 'plants:create',
    name: 'Create Plants',
    description: 'Create new plant entries',
    resource: 'plants',
    action: 'create',
  },
  {
    id: 'plants:read',
    name: 'View Plants',
    description: 'View plant information',
    resource: 'plants',
    action: 'read',
  },
];

// RBAC Service
export class RBACService {
  private static instance: RBACService;
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();

  private constructor() {
    this.initializeRoles();
  }

  public static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  private initializeRoles(): void {
    // Default roles
    const defaultRoles: Role[] = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access',
        permissions: PERMISSIONS.map(p => p.id),
      },
      {
        id: 'user',
        name: 'Regular User',
        description: 'Limited access',
        permissions: ['plants:read', 'plants:update'],
      },
    ];

    defaultRoles.forEach(role => this.roles.set(role.id, role));
    PERMISSIONS.forEach(perm => this.permissions.set(perm.id, perm));
  }

  public hasPermission(user: User, permissionId: string): boolean {
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.some(p => p.id === permissionId);
  }

  public getUserPermissions(user: User): Permission[] {
    const permissions: Set<string> = new Set(user.customPermissions || []);

    user.roles.forEach(roleId => {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach(pId => permissions.add(pId));
      }
    });

    return Array.from(permissions)
      .map(pId => this.permissions.get(pId))
      .filter((p): p is Permission => p !== undefined);
  }

  public getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }
}

// React Hook for RBAC
export const useRBAC = (user: User) => {
  const rbacService = useMemo(() => RBACService.getInstance(), []);

  const checkPermission = useCallback(
    (permissionId: string) => rbacService.hasPermission(user, permissionId),
    [user, rbacService]
  );

  const getUserPermissions = useCallback(
    () => rbacService.getUserPermissions(user),
    [user, rbacService]
  );

  return {
    checkPermission,
    getUserPermissions,
    rbacService,
  };
};

// Higher-Order Component for protecting routes and components
interface WithPermissionProps {
  permissionId: string;
  user: User;
  fallback?: React.ReactNode;
}

export const WithPermission = <P extends WithPermissionProps>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const { checkPermission } = useRBAC(props.user);

    if (!checkPermission(props.permissionId)) {
      return props.fallback || <div>Access Denied</div>;
    }

    return <Component {...props} />;
  };
};
