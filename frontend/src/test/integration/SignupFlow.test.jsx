import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../pages/Signup';

describe('Signup Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should complete full signup flow', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const signupButton = screen.getByRole('button', { name: /sign up/i });

    // Fill in form
    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'SecurePass123');
    await user.type(confirmPasswordInput, 'SecurePass123');

    // Submit form
    await user.click(signupButton);

    // Wait for success message or redirect
    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display password strength indicator', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    
    // Type weak password
    await user.type(passwordInput, 'weak');
    expect(screen.getByText(/password strength:/i)).toBeInTheDocument();

    // Clear and type strong password
    await user.clear(passwordInput);
    await user.type(passwordInput, 'StrongPass123!');
    
    // Should show updated strength
    expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
  });

  it('should validate password match on submit', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const signupButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Different123');

    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should require uppercase and lowercase in password', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const signupButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Password must contain uppercase and lowercase letters')).toBeInTheDocument();
    });
  });
});
