import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../../services/userService';

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const result = await userService.getProfile();

      expect(result.email).toBe('john.doe@example.com');
      expect(result.fullName).toBe('John Doe');
      expect(result.role).toBe('admin');
    });

    it('should return all user properties', async () => {
      const result = await userService.getProfile();

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('fullName');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('status');
    });
  });

  describe('updateProfile', () => {
    it('should update profile with valid data', async () => {
      const updateData = { fullName: 'Updated Name', email: 'updated@example.com' };
      const result = await userService.updateProfile(updateData);

      expect(result.fullName).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
    });

    it('should return updated user object', async () => {
      const updateData = { fullName: 'New Name', email: 'new@example.com' };
      const result = await userService.updateProfile(updateData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('changePassword', () => {
    it('should successfully change password with correct current password', async () => {
      const result = await userService.changePassword('SecurePass123', 'NewPass456');

      expect(result.message).toBe('Password updated');
    });

    it('should reject incorrect current password', async () => {
      try {
        await userService.changePassword('WrongPassword', 'NewPass456');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data?.error?.message).toContain('Current password incorrect');
      }
    });
  });

  describe('getAllUsers', () => {
    it('should fetch users with pagination', async () => {
      const result = await userService.getAllUsers(1, 10);

      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return pagination metadata', async () => {
      const result = await userService.getAllUsers(1, 10);

      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('pages');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('limit');
    });

    it('should contain user objects with required properties', async () => {
      const result = await userService.getAllUsers(1, 10);

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0]).toHaveProperty('email');
      expect(result.items[0]).toHaveProperty('fullName');
      expect(result.items[0]).toHaveProperty('role');
      expect(result.items[0]).toHaveProperty('status');
    });
  });

  describe('activateUser', () => {
    it('should activate a user', async () => {
      const result = await userService.activateUser('76c901ec-4040-41ed-8d9c-a60e875a445c');

      expect(result.id).toBe('76c901ec-4040-41ed-8d9c-a60e875a445c');
      expect(result.status).toBe('active');
      expect(result.email).toBe('abhisheksingh@gmail.com');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user', async () => {
      const result = await userService.deactivateUser('76c901ec-4040-41ed-8d9c-a60e875a445c');

      expect(result.id).toBe('76c901ec-4040-41ed-8d9c-a60e875a445c');
      expect(result.status).toBe('inactive');
      expect(result.email).toBe('abhisheksingh@gmail.com');
    });
  });
});
