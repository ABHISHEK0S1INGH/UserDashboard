# User Management API - Testing Guide

## Test Users Available

### Admin User
- **Email**: admin@example.com
- **Password**: Admin123
- **Role**: admin

### Regular User
- **Email**: user@example.com
- **Password**: User123
- **Role**: user

---

## ADMIN FUNCTIONS

### 1. Login as Admin
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123"
  }'
```

**Save the token from response for next requests.**

### 2. View All Users (with Pagination)
```bash
# Page 1, 10 users per page
curl http://localhost:8000/api/users?page=1&limit=10 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# Page 2, 5 users per page
curl http://localhost:8000/api/users?page=2&limit=5 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Regular User",
      "role": "user",
      "status": "active"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 3,
  "pages": 1
}
```

### 3. Activate User Account
```bash
curl -X POST http://localhost:8000/api/users/USER_ID/activate \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 4. Deactivate User Account
```bash
curl -X POST http://localhost:8000/api/users/USER_ID/deactivate \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## USER FUNCTIONS

### 1. Login as Regular User
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "User123"
  }'
```

**Save the token from response.**

### 2. View Own Profile
```bash
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer USER_TOKEN_HERE"
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "Regular User",
  "role": "user",
  "status": "active",
  "createdAt": "2025-12-29T17:00:00",
  "updatedAt": "2025-12-29T17:00:00",
  "lastLoginAt": "2025-12-29T17:30:00"
}
```

### 3. Update Full Name and Email
```bash
curl -X PUT http://localhost:8000/api/profile \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "email": "newemail@example.com"
  }'
```

### 4. Change Password
```bash
curl -X PUT http://localhost:8000/api/profile/password \
  -H "Authorization: Bearer USER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "User123",
    "newPassword": "NewSecure456"
  }'
```

---

## SIGNUP NEW USER

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePass123"
  }'
```

**New users are created with:**
- Role: `user` (default)
- Status: `active`

---

## ROLE-BASED ACCESS CONTROL

### ✅ Admin Can:
- View all users (GET /api/users)
- Activate users (POST /api/users/{id}/activate)
- Deactivate users (POST /api/users/{id}/deactivate)
- View own profile (GET /api/profile)
- Update own profile (PUT /api/profile)
- Change own password (PUT /api/profile/password)

### ✅ Regular User Can:
- View own profile (GET /api/profile)
- Update own profile (PUT /api/profile)
- Change own password (PUT /api/profile/password)

### ❌ Regular User CANNOT:
- View all users (403 Forbidden)
- Activate/deactivate other users (403 Forbidden)

---

## Error Responses

### 401 Unauthorized (No token or invalid token)
```json
{
  "msg": "Missing Authorization Header"
}
```

### 403 Forbidden (User trying to access admin endpoint)
```json
{
  "error": {
    "code": "forbidden",
    "message": "Not allowed"
  }
}
```

### 400 Bad Request (Validation error)
```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid email format"
  }
}
```

---

## Quick Test Flow

1. **Login as admin** → Get admin token
2. **View all users** → See list with pagination
3. **Login as regular user** → Get user token
4. **Try to view all users with user token** → Get 403 Forbidden
5. **View own profile** → Success
6. **Update profile** → Success
7. **Change password** → Success
8. **Login with new password** → Success
9. **Login as admin again** → Get new admin token
10. **Deactivate the user** → Success
11. **Try to login as deactivated user** → Get "Account is inactive" error
