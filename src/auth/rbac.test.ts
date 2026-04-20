import { describe, expect, it } from 'vitest';
import { PERMISSIONS, RBACService, type User } from './rbac';

describe('RBACService', () => {
  it('keeps singleton instance stable', () => {
    const first = RBACService.getInstance();
    const second = RBACService.getInstance();
    expect(first).toBe(second);
  });

  it('grants admin all declared permissions', () => {
    const service = RBACService.getInstance();
    const admin: User = {
      id: '1',
      email: 'admin@virida.io',
      roles: ['admin'],
    };

    PERMISSIONS.forEach(permission => {
      expect(service.hasPermission(admin, permission.id)).toBe(true);
    });
  });

  it('merges role permissions and custom permissions', () => {
    const service = RBACService.getInstance();
    const user: User = {
      id: '2',
      email: 'user@virida.io',
      roles: ['user'],
      customPermissions: ['plants:create'],
    };

    const permissions = service.getUserPermissions(user).map(p => p.id);
    expect(permissions).toContain('plants:read');
    expect(permissions).toContain('plants:create');
  });

  it('returns false for unknown permission', () => {
    const service = RBACService.getInstance();
    const user: User = {
      id: '3',
      email: 'guest@virida.io',
      roles: ['user'],
    };

    expect(service.hasPermission(user, 'unknown:permission')).toBe(false);
  });
});
