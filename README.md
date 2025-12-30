# User Management Dashboard

A full-stack web application for user management with role-based access control (RBAC), featuring JWT authentication, admin dashboard, and user profiles.

## 📋 Project Overview

This application provides a comprehensive user management system with the following capabilities:

- **User Authentication**: Secure signup and login with JWT tokens
- **Role-Based Access Control**: Separate interfaces for admins and regular users
- **Admin Dashboard**: Manage users (activate/deactivate), view all users with pagination
- **User Profile Management**: Users can update their profile information and change passwords
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production-Ready**: Deployed with PostgreSQL database and modern hosting platforms

**Purpose**: To demonstrate a production-grade full-stack application with secure authentication, authorization, and user management capabilities suitable for enterprise use cases.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0 (Python)
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy with Flask-Migrate
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: bcrypt (Flask-Bcrypt)
- **WSGI Server**: Gunicorn
- **CORS**: Flask-CORS
- **Testing**: pytest, pytest-cov
- **Environment Management**: python-dotenv

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Routing**: React Router DOM 6.20
- **HTTP Client**: Axios 1.6
- **Testing**: Vitest, Testing Library
- **Styling**: Custom CSS with responsive design

### Deployment
- **Backend**: Render.com (with PostgreSQL)
- **Frontend**: Vercel
- **Database**: PostgreSQL on Render

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **PostgreSQL** 12+ (for production) or SQLite (for development)
- Git

---

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd backend/backend
```

#### 2. Create Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure Environment Variables

Create a `.env` file in `backend/backend/`:

```env
FLASK_APP=wsgi.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# For Development (SQLite)
DATABASE_URL=sqlite:///app.db

# For Production (PostgreSQL)
# DATABASE_URL=postgresql://username:password@localhost:5432/dbname

CORS_ORIGINS=http://localhost:5173
```

**Generate secure keys:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### 5. Initialize Database
```bash
flask db upgrade
```

#### 6. (Optional) Create Admin User

```bash
python3 seed_users.py
```

Or manually:
```bash
python3 -c "
from app import create_app, db
from app.models.user import User
from app.core.security import hash_password

app = create_app()
with app.app_context():
    admin = User(
        email='admin@example.com',
        password_hash=hash_password('Admin123'),
        full_name='Admin User',
        role='admin',
        status='active'
    )
    db.session.add(admin)
    db.session.commit()
    print('Admin created: admin@example.com / Admin123')
"
```

#### 7. Run Development Server
```bash
python wsgi.py
# or
flask run --port 8000
```

Backend will be running at `http://localhost:8000`

---

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure API URL

Edit `src/services/authService.js` to point to your backend:

```javascript
const API_URL = 'http://localhost:8000/api';  // For local development
```

#### 4. Run Development Server
```bash
npm run dev
```

Frontend will be running at `http://localhost:5173`

#### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_APP` | Entry point for Flask | `wsgi.py` |
| `FLASK_ENV` | Environment mode | `development` or `production` |
| `SECRET_KEY` | Flask secret key (32+ chars) | Generate with `secrets.token_hex(32)` |
| `JWT_SECRET_KEY` | JWT signing key (32+ chars) | Generate with `secrets.token_hex(32)` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` or `sqlite:///app.db` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173,https://yourdomain.com` |

### Frontend

No `.env` file needed. API URL is configured directly in `src/services/authService.js`.

---

## 🌐 Deployment Instructions

### Backend Deployment (Render)

#### 1. Prepare Repository
```bash
cd /home/abhishek/UserDashboard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/UserDashboard.git
git push -u origin main
```

#### 2. Create PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Configure database and create
4. Copy the **Internal Database URL**

#### 3. Create Web Service on Render
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `user-dashboard-backend`
   - **Root Directory**: `backend/backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app`

#### 4. Set Environment Variables
Add in Render dashboard:
```
FLASK_ENV=production
FLASK_APP=wsgi.py
SECRET_KEY=<generate-new-secret>
JWT_SECRET_KEY=<generate-new-secret>
DATABASE_URL=<postgresql-url-from-render>
CORS_ORIGINS=https://your-frontend.vercel.app
```

#### 5. Run Database Migrations
After deployment, open Render Shell:
```bash
flask db upgrade
python seed_users.py  # Optional: create admin user
```

---

### Frontend Deployment (Vercel)

#### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

#### 2. Deploy via Vercel Dashboard
1. Go to [Vercel](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. Update API URL
Before deploying, update `frontend/src/services/authService.js`:
```javascript
const API_URL = 'https://user-dashboard-backend.onrender.com/api';
```

#### 4. Add vercel.json (Already Included)
The `frontend/vercel.json` file ensures client-side routing works:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 5. Deploy
Push changes to trigger automatic deployment:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:8000/api`
- **Production**: `https://userdashboard-backend-x12r.onrender.com/api`

---

### Authentication Endpoints

#### 1. User Signup
**POST** `/auth/signup`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active",
    "createdAt": "2025-12-30T10:00:00Z",
    "updatedAt": "2025-12-30T10:00:00Z",
    "lastLoginAt": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 2. User Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active",
    "createdAt": "2025-12-30T10:00:00Z",
    "updatedAt": "2025-12-30T10:00:00Z",
    "lastLoginAt": "2025-12-30T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "user",
  "status": "active",
  "createdAt": "2025-12-30T10:00:00Z",
  "updatedAt": "2025-12-30T10:00:00Z",
  "lastLoginAt": "2025-12-30T10:30:00Z"
}
```

---

#### 4. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### User Management Endpoints (Admin Only)

#### 5. List All Users
**GET** `/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "email": "user1@example.com",
      "fullName": "User One",
      "role": "user",
      "status": "active",
      "createdAt": "2025-12-29T08:00:00Z",
      "updatedAt": "2025-12-29T08:00:00Z",
      "lastLoginAt": "2025-12-30T09:00:00Z"
    },
    {
      "id": "uuid-2",
      "email": "user2@example.com",
      "fullName": "User Two",
      "role": "user",
      "status": "inactive",
      "createdAt": "2025-12-28T12:00:00Z",
      "updatedAt": "2025-12-30T10:00:00Z",
      "lastLoginAt": "2025-12-29T14:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3,
  "limit": 10
}
```

---

#### 6. Activate User
**POST** `/users/{user_id}/activate`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "User activated successfully"
}
```

---

#### 7. Deactivate User
**POST** `/users/{user_id}/deactivate`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "message": "User deactivated successfully"
}
```

---

### User Profile Endpoints

#### 8. Get Profile
**GET** `/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "user",
  "status": "active",
  "createdAt": "2025-12-30T10:00:00Z",
  "updatedAt": "2025-12-30T10:00:00Z",
  "lastLoginAt": "2025-12-30T10:30:00Z"
}
```

---

#### 9. Update Profile
**PUT** `/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-string",
    "email": "johnupdated@example.com",
    "fullName": "John Updated",
    "role": "user",
    "status": "active",
    "createdAt": "2025-12-30T10:00:00Z",
    "updatedAt": "2025-12-30T11:00:00Z",
    "lastLoginAt": "2025-12-30T10:30:00Z"
  }
}
```

---

#### 10. Change Password
**PUT** `/profile/password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Health Check

#### 11. Health Check
**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy"
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend/backend
pytest
pytest --cov=app tests/
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

---

## 📁 Project Structure

```
UserDashboard/
├── backend/
│   └── backend/
│       ├── app/
│       │   ├── __init__.py
│       │   ├── config.py
│       │   ├── extensions.py
│       │   ├── auth/
│       │   │   └── routes.py
│       │   ├── users/
│       │   │   └── routes.py
│       │   ├── models/
│       │   │   └── user.py
│       │   ├── schemas/
│       │   │   ├── auth.py
│       │   │   └── user.py
│       │   ├── services/
│       │   │   ├── auth_service.py
│       │   │   └── user_service.py
│       │   └── core/
│       │       ├── security.py
│       │       └── decorators.py
│       ├── migrations/
│       ├── tests/
│       ├── wsgi.py
│       ├── requirements.txt
│       ├── Procfile
│       └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── userService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md (this file)
```

---

## 🎯 Features

### ✅ Implemented
- ✅ User registration and authentication
- ✅ JWT-based secure authentication
- ✅ Role-based access control (Admin/User)
- ✅ Admin dashboard with user management
- ✅ User profile management
- ✅ Password change functionality
- ✅ Responsive UI design
- ✅ Form validation (client & server)
- ✅ Loading states and error handling
- ✅ Pagination for user lists
- ✅ Confirmation dialogs for destructive actions
- ✅ Toast notifications
- ✅ Database migrations
- ✅ Production deployment
- ✅ Unit tests (backend & frontend)

---

## 🔒 Security Features

- Bcrypt password hashing
- JWT token-based authentication (6-hour expiry)
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- Input validation and sanitization
- Protected routes with authentication middleware
- Role-based authorization
- Secure password requirements

---

## 👥 Default Credentials

After running `seed_users.py`:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `User123`

---

## 📝 License

This project is created for demonstration purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please contact: Purple Merit Technologies

---

## 🎉 Live Demo

- **Frontend**: https://user-dashboard-frontend-rho.vercel.app
- **Backend API**: https://userdashboard-backend-x12r.onrender.com
- **API Health**: https://userdashboard-backend-x12r.onrender.com/health

---

**Built with ❤️ using Flask & React**
