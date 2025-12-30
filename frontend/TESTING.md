# Frontend Testing Guide

This document provides a comprehensive guide to the frontend testing setup and how to run tests.

## Testing Stack

- **Vitest** - Fast unit test framework powered by Vite
- **React Testing Library** - Testing utilities for React components
- **MSW (Mock Service Worker)** - API mocking at the network level
- **jsdom** - JavaScript implementation of DOM for testing

## Project Structure

```
src/test/
├── mocks/
│   └── handlers.js          # MSW request handlers
├── setup.js                 # Test environment setup
├── services/
│   ├── authService.test.js  # Auth service unit tests
│   └── userService.test.js  # User service unit tests
├── components/
│   ├── Login.test.jsx       # Login component tests
│   ├── Signup.test.jsx      # Signup component tests
│   ├── UIComponents.test.jsx # Modal, Spinner, etc.
│   └── Routes.test.jsx      # Route protection tests
└── integration/
    ├── LoginFlow.test.jsx   # Full login flow tests
    └── SignupFlow.test.jsx  # Full signup flow tests
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all testing dependencies including Vitest, React Testing Library, and MSW.

### 2. Configuration Files

The project is configured with:

- **vite.config.js** - Vitest configuration with jsdom environment
- **src/test/setup.js** - Test environment initialization and mocks
- **src/test/mocks/handlers.js** - API endpoint mocks

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with UI

```bash
npm run test:ui
```

This opens an interactive UI where you can see test results in real-time.

### Run Specific Test File

```bash
npm test -- src/test/services/authService.test.js
```

### Generate Coverage Report

```bash
npm run test:coverage
```

This generates a coverage report showing which parts of the code are tested.

## Test Categories

### 1. Unit Tests - Services

#### AuthService Tests (`src/test/services/authService.test.js`)
- ✅ Login with valid credentials
- ✅ Reject invalid credentials
- ✅ Store token and user in localStorage
- ✅ Signup with valid data
- ✅ Reject invalid signup data
- ✅ Clear localStorage on logout
- ✅ Fetch user info
- ✅ Get current user
- ✅ Check authentication status
- ✅ Get token

#### UserService Tests (`src/test/services/userService.test.js`)
- ✅ Fetch user profile
- ✅ Update profile with valid data
- ✅ Change password with correct current password
- ✅ Reject incorrect current password
- ✅ Fetch users with pagination
- ✅ Return pagination metadata
- ✅ Activate user
- ✅ Deactivate user

### 2. Component Tests

#### Login Component (`src/test/components/Login.test.jsx`)
- ✅ Render login form
- ✅ Show link to signup
- ✅ Validate required fields
- ✅ Validate email format
- ✅ Validate password length
- ✅ Clear errors on input change
- ✅ Disable button during loading

#### Signup Component (`src/test/components/Signup.test.jsx`)
- ✅ Render signup form
- ✅ Validate all required fields
- ✅ Validate email format
- ✅ Validate password strength
- ✅ Validate password confirmation
- ✅ Show password strength indicator
- ✅ Show link to login

#### UI Components (`src/test/components/UIComponents.test.jsx`)
- ✅ Modal renders when open
- ✅ Modal hides when closed
- ✅ Modal calls onClose
- ✅ ConfirmDialog renders
- ✅ ConfirmDialog calls onConfirm
- ✅ LoadingSpinner renders
- ✅ LoadingSpinner displays message
- ✅ LoadingSpinner supports multiple sizes

#### Routes (`src/test/components/Routes.test.jsx`)
- ✅ PrivateRoute renders protected component when authenticated
- ✅ PrivateRoute redirects to login when not authenticated

### 3. Integration Tests

#### Login Flow (`src/test/integration/LoginFlow.test.jsx`)
- ✅ Complete full login flow with valid credentials
- ✅ Show error message for invalid credentials
- ✅ Handle validation errors before submission
- ✅ Maintain form state while typing

#### Signup Flow (`src/test/integration/SignupFlow.test.jsx`)
- ✅ Complete full signup flow
- ✅ Display password strength indicator
- ✅ Validate password match on submit
- ✅ Require uppercase and lowercase in password

## Mock API Endpoints

The test suite mocks the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Change password

### Users (Admin)
- `GET /api/users` - List all users with pagination
- `PUT /api/users/:userId/activate` - Activate user
- `PUT /api/users/:userId/deactivate` - Deactivate user

## Test Data

### Valid Login Credentials
- Email: `john.doe@example.com`
- Password: `SecurePass123`

### Valid Signup Data
- Full Name: Any valid name
- Email: Any valid email format
- Password: Must meet strength requirements (8+ chars, uppercase, lowercase, number)

## Writing New Tests

### Basic Test Structure

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = processInput(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Testing React Components

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('MyComponent', () => {
  it('should render and interact', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );

    // Query elements
    const button = screen.getByRole('button', { name: /click me/i });
    
    // Interact with elements
    await user.click(button);
    
    // Assert results
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Debugging Tests

### Enable Debug Output

```javascript
import { render, screen, debug } from '@testing-library/react';

it('should debug', () => {
  render(<MyComponent />);
  
  // Print the entire DOM
  screen.debug();
  
  // Print specific element
  debug(screen.getByText('Text'));
});
```

### View Test Results in Detail

```bash
npm test -- --reporter=verbose
```

### Run Single Test

```javascript
it.only('should run only this test', () => {
  // test code
});
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Test what users see and interact with
   - Avoid testing internal state

2. **Use Meaningful Test Names**
   - Should clearly describe what is being tested
   - Use "should..." convention

3. **Keep Tests Independent**
   - Each test should be able to run alone
   - Use beforeEach for common setup

4. **Mock External Dependencies**
   - Mock API calls with MSW
   - Mock functions with vi.fn()
   - Mock modules with vi.mock()

5. **Test User Interactions**
   - Use userEvent for realistic interactions
   - Avoid directly calling component methods

6. **Use Proper Assertions**
   - Prefer specific matchers over vague ones
   - Use toBeInTheDocument() for DOM elements
   - Use proper waitFor for async operations

## Common Issues and Solutions

### Issue: Tests timeout
**Solution:** Increase timeout in test or check for missing async/await

```javascript
await waitFor(() => {
  expect(...).toBeInTheDocument();
}, { timeout: 5000 });
```

### Issue: Cannot find element
**Solution:** Use screen.logTestingPlaygroundURL() to debug

```javascript
screen.logTestingPlaygroundURL();
```

### Issue: Act warnings
**Solution:** Wrap state updates in act() or use userEvent properly

```javascript
await waitFor(() => {
  expect(...).toBeInTheDocument();
});
```

## CI/CD Integration

To run tests in CI/CD pipeline:

```bash
npm test -- --run  # Run tests once without watch mode
npm run test:coverage  # Generate coverage report
```

## Test Coverage Goals

Aim for:
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

Check current coverage:

```bash
npm run test:coverage
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Running Tests During Development

It's recommended to run tests in watch mode while developing:

```bash
npm test -- --watch
```

This will:
- Re-run tests on file changes
- Provide instant feedback
- Allow you to quickly fix issues

## Contributing Tests

When adding new features:

1. Write tests first (TDD approach) or after (but always!)
2. Ensure tests pass locally
3. Maintain or increase code coverage
4. Update this documentation if adding new test categories
