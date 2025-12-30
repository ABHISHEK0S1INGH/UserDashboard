import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../../services/authService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const result = await authService.login('john.doe@example.com', 'SecurePass123');

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('john.doe@example.com');
      expect(result.user.role).toBe('admin');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
    });

    it('should reject invalid credentials', async () => {
      try {
        await authService.login('invalid@example.com', 'wrongpassword');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.response?.status).toBe(401);
      }
    });

    it('should store token and user in localStorage', async () => {
      await authService.login('john.doe@example.com', 'SecurePass123');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'token',
        expect.stringContaining('test-jwt-token')
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('john.doe@example.com')
      );
    });
  });

  describe('signup', () => {
    it('should successfully signup with valid data', async () => {
      const result = await authService.signup(
        'New User',
        'newuser@example.com',
        'NewPass123'
      );

      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.role).toBe('user');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should reject invalid signup data', async () => {
      try {
        await authService.signup('', '', '');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.response?.status).toBe(400);
      }
    });
  });

  describe('logout', () => {
    it('should clear localStorage on logout', async () => {
      localStorage.getItem.mockReturnValue('test-token');
      
      await authService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('should not throw if no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);
      
      expect(() => authService.logout()).not.toThrow();
    });
  });

  describe('getUserInfo', () => {
    it('should fetch and return user info', async () => {
      const result = await authService.getUserInfo();

      expect(result.email).toBe('john.doe@example.com');
      expect(result.fullName).toBe('John Doe');
      expect(result.role).toBe('admin');
    });

    it('should update localStorage with fresh user data', async () => {
      await authService.getUserInfo();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('john.doe@example.com')
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const user = authService.getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      localStorage.getItem.mockReturnValue(null);

      const user = authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.getItem.mockReturnValue('test-token');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if token does not exist', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.getItem.mockReturnValue('test-token');

      const token = authService.getToken();

      expect(token).toBe('test-token');
    });
  });
});
