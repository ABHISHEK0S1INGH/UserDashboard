import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../pages/Signup';
import userEvent from '@testing-library/user-event';

// Mock the authService
vi.mock('../../services/authService', () => ({
  authService: {
    signup: vi.fn(),
    isAuthenticated: vi.fn(() => false),
  }
}));

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignup = () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  };

  it('should render signup form', () => {
    renderSignup();

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('should validate all required fields', async () => {
    const user = userEvent.setup();
    renderSignup();

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderSignup();

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Email format is invalid')).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    renderSignup();

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'weak');

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();
    renderSignup();

    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'StrongPass123');
    await user.type(confirmPasswordInput, 'DifferentPass123');

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should show password strength indicator', async () => {
    const user = userEvent.setup();
    renderSignup();

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'StrongPass123');

    await waitFor(() => {
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    });
  });

  it('should show link to login page', () => {
    renderSignup();

    const loginLink = screen.getByText(/login/i);
    expect(loginLink).toBeInTheDocument();
  });
});
