import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';

// Mock authService
vi.mock('../../services/authService', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
  }
}));

const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute Component', () => {
  it('should render protected component when authenticated', () => {
    const { authService } = require('../../services/authService');
    authService.isAuthenticated.mockReturnValue(true);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    const { authService } = require('../../services/authService');
    authService.isAuthenticated.mockReturnValue(false);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      </BrowserRouter>
    );

    // When redirected, the test component content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
