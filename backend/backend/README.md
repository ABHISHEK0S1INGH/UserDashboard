# Backend - User Management API

Flask-based REST API with JWT authentication, role-based access control, and PostgreSQL database.

## Tech Stack

- **Framework**: Flask 3.0
- **Database**: PostgreSQL (via psycopg3) or SQLite for development
- **ORM**: SQLAlchemy with Flask-Migrate
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: bcrypt

## Setup Instructions

### 1. Prerequisites

- Python 3.9+
- PostgreSQL 12+ (or use SQLite for development)

### 2. Install Dependencies

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
FLASK_APP=wsgi.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# Or SQLite for development
# DATABASE_URL=sqlite:///app.db

CORS_ORIGINS=http://localhost:5173
```

**Replace:**
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `dbname` with your database name (e.g., `user_management`)

### 4. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE user_management;

# Create user (if needed)
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE user_management TO myuser;

# Exit
\q
```

### 5. Initialize Database

```bash
# Initialize migrations (first time only)
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

### 6. Run Development Server

```bash
python wsgi.py
# or
flask run --port 8000
```

Server runs at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires JWT)
- `POST /api/auth/logout` - Logout (client-side token removal)

### User Management (Admin Only)
- `GET /api/users?page=1&limit=10` - List all users with pagination
- `POST /api/users/{id}/activate` - Activate user account
- `POST /api/users/{id}/deactivate` - Deactivate user account

### User Profile
- `GET /api/profile` - Get own profile
- `PUT /api/profile` - Update name and email
- `PUT /api/profile/password` - Change password

## Request/Response Examples

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active"
  },
  "token": "jwt-token-here"
}
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Access Protected Route
```bash
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Seed Admin User

To create an admin user for testing:

```bash
python - <<'PY'
import sys
sys.path.insert(0, '.')
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
    print('Admin user created: admin@example.com / Admin123')
PY
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration
│   ├── extensions.py        # Flask extensions
│   ├── auth/
│   │   └── routes.py        # Auth endpoints
│   ├── users/
│   │   └── routes.py        # User endpoints
│   ├── models/
│   │   └── user.py          # User model
│   ├── schemas/
│   │   ├── auth.py          # Auth request schemas
│   │   └── user.py          # User request schemas
│   ├── services/
│   │   ├── auth_service.py  # Auth business logic
│   │   └── user_service.py  # User CRUD logic
│   └── core/
│       ├── security.py      # Password hashing
│       └── decorators.py    # RBAC decorators
├── migrations/              # Database migrations
├── tests/                   # Unit tests
├── wsgi.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## Deployment

### Environment Variables for Production

Set these in your hosting platform (Render, Railway, Heroku, etc.):

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Random secret (use `python -c "import secrets; print(secrets.token_hex(32))"`)
- `JWT_SECRET_KEY` - JWT secret (use same command as above)
- `CORS_ORIGINS` - Frontend URL (e.g., `https://yourapp.vercel.app`)

### Deploy to Render

1. Create PostgreSQL database on Render
2. Create Web Service
3. Set environment variables
4. Build command: `pip install -r requirements.txt`
5. Start command: `flask db upgrade && gunicorn wsgi:app`

Install gunicorn: `pip install gunicorn`
