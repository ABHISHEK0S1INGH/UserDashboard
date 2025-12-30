# Authentication Frontend

A complete React-based authentication and user management system with role-based access control.

## ✅ Features Implemented

### 🔐 Authentication System
- **Login Page**
  - Email and password input fields
  - Client-side form validation
  - Redirects to dashboard on success (role-based)
  - Error message display
  - Link to signup page

- **Signup Page**
  - Full name, email, password, confirm password inputs
  - Required field validation
  - Email format validation
  - Password strength validation with visual indicator
  - Password confirmation matching
  - Server-side error display
  - Redirects to login page on successful registration

### 🛡️ Protected Routes
- ✅ Prevent unauthenticated access
- ✅ Admin-only pages restricted to admins (AdminRoute component)
- ✅ Redirect to login for unauthorized users
- ✅ Role-based routing (Admin → `/admin`, User → `/dashboard`)
- ✅ Automatic token-based authentication check

### 👑 Admin Dashboard
- **User Management Table**
  - Display all users with columns: email, full name, role, status, created date
  - Pagination (10 users per page)
  - Activate user button
  - Deactivate user button
  - Confirmation dialog before actions
  - Success/error notifications
  - Color-coded role and status badges

### 👤 User Profile Page
- Display user information (full name, email, role, status)
- Edit full name and email
- Change password section
- Save and cancel buttons
- Success/error messages after updates
- Accessible to both admin and regular users

### 🎨 User Interface Components

#### Input Fields
- ✅ Validation messages displayed below fields
- ✅ Error state styling (red border)
- ✅ Clear placeholder text
- ✅ Focus states

#### Buttons
- ✅ **Primary action buttons** (Login, Save, Activate) - Blue
- ✅ **Secondary action buttons** (Cancel, Back) - Gray
- ✅ **Destructive action buttons** (Logout, Deactivate, Delete) - Red
- ✅ **Success action buttons** (Activate) - Green
- ✅ Disabled states
- ✅ Hover effects

#### Loading States
- ✅ **Loading spinners** during API calls
  - Small, medium, and large sizes
  - Optional loading message
  - Smooth animations
- ✅ Button loading states
- ✅ Page-level loading indicators

#### Notifications (Toast)
- ✅ **Success notifications** (Green)
- ✅ **Error notifications** (Red)
- ✅ **Warning notifications** (Orange)
- ✅ **Info notifications** (Blue)
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual close button
- ✅ Slide-in animation
- ✅ Stacked notifications support

#### Dialogs & Modals
- ✅ **Modal component** for overlays
- ✅ **Confirmation dialogs** for destructive actions
- ✅ Close on overlay click
- ✅ Close button
- ✅ Prevent body scroll when open

#### Tables
- ✅ Clean, responsive table design
- ✅ Hover effects on rows
- ✅ **Pagination** with:
  - Previous/Next buttons
  - Current page indicator
  - Disabled state for boundary pages
  - Page number display

#### Error Messages
- ✅ Clear, user-friendly error messages
- ✅ Field-specific validation errors
- ✅ Server error display
- ✅ Network error handling

#### Responsive Design
- ✅ **Desktop** - Full-width layouts
- ✅ **Mobile** - Responsive tables, stacked layouts
- ✅ Touch-friendly buttons
- ✅ Optimized spacing for small screens

## 📁 Project Structure

```
src/
├── components/
│   ├── PrivateRoute.jsx          # Protected route wrapper
│   ├── AdminRoute.jsx             # Admin-only route wrapper
│   ├── Modal.jsx                  # Reusable modal component
│   ├── ConfirmDialog.jsx          # Confirmation dialog
│   ├── Notification.jsx           # Toast notification system
│   └── LoadingSpinner.jsx         # Loading spinner component
├── pages/
│   ├── Login.jsx                  # Login page
│   ├── Signup.jsx                 # Signup page
│   ├── Dashboard.jsx              # User dashboard
│   ├── AdminDashboard.jsx         # Admin dashboard
│   └── UserProfile.jsx            # User profile page
├── services/
│   ├── authService.js             # Authentication API service
│   └── userService.js             # User management API service
├── App.jsx                        # Main app with routing
├── main.jsx                       # Application entry point
└── index.css                      # Global styles
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL:**
   The API URL is already configured in `src/services/authService.js`:
   ```javascript
   const API_URL = 'https://userdashboard-backend-x12r.onrender.com/api';
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔌 API Integration

The application is configured to work with the following endpoints:

### Authentication Endpoints

#### Login
- **POST** `/api/auth/login`
- **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "admin|user",
      "status": "active|inactive",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "lastLoginAt": "timestamp"
    }
  }
  ```

#### Signup
- **POST** `/api/auth/signup`
- **Request:**
  ```json
  {
    "fullName": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### User Management Endpoints (Admin)

#### Get All Users
- **GET** `/api/users?page=1&limit=10`

#### Activate User
- **PUT** `/api/users/{userId}/activate`

#### Deactivate User
- **PUT** `/api/users/{userId}/deactivate`

### User Profile Endpoints

#### Get Profile
- **GET** `/api/users/profile`

#### Update Profile
- **PUT** `/api/users/{userId}`
- **Request:**
  ```json
  {
    "fullName": "New Name",
    "email": "new@example.com"
  }
  ```

#### Change Password
- **PUT** `/api/users/{userId}/password`
- **Request:**
  ```json
  {
    "currentPassword": "old_password",
    "newPassword": "new_password"
  }
  ```

## 🎯 Form Validations

### Login
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Signup
- Full Name: Required, minimum 2 characters
- Email: Required, valid email format
- Password: Required, minimum 8 characters, must contain:
  - Uppercase letter
  - Lowercase letter
  - Number
- Confirm Password: Must match password

### Profile Update
- Full Name: Required, minimum 2 characters
- Email: Required, valid email format

### Change Password
- Current Password: Required
- New Password: Required, minimum 8 characters
- Confirm Password: Must match new password

## 🔐 Security Features

- Token-based authentication (JWT)
- Role-based access control (RBAC)
- Protected routes
- Admin-only routes
- Automatic token refresh
- Secure password validation
- XSS protection through React
- CORS configuration

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations and transitions
- Color-coded badges and indicators
- Intuitive navigation
- Confirmation dialogs for destructive actions
- Real-time form validation
- Loading states for all async operations
- Toast notifications for user feedback
- Fully responsive layout

## 🛠️ Technologies Used

- **React 18** - UI library with Hooks
- **React Router DOM 6** - Routing and navigation
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **LocalStorage** - Token and user data persistence

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔄 Authentication Flow

1. User visits the application
2. Checks for existing authentication token
3. If authenticated:
   - Admin users → `/admin` dashboard
   - Regular users → `/dashboard`
4. If not authenticated → `/login` page
5. After login → Token stored in localStorage
6. All API requests include Bearer token
7. On logout → Token and user data cleared

## 📝 Development

The application uses Vite for fast development with hot module replacement (HMR). The dev server runs on `http://localhost:3000` by default (or next available port).

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎉 Complete Feature Checklist

- ✅ Login page with validation
- ✅ Signup page with password strength indicator
- ✅ User dashboard
- ✅ Admin dashboard with user management
- ✅ User profile with edit capabilities
- ✅ Change password functionality
- ✅ Protected routes
- ✅ Admin-only routes
- ✅ Role-based redirects
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Confirmation dialogs
- ✅ Loading spinners
- ✅ Pagination
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Token-based authentication
- ✅ API integration
