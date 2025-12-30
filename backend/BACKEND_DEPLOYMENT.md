# Backend Deployment Guide

## ✅ Backend Ready for Deployment

Your Flask backend is production-ready:
- ✅ All endpoints working
- ✅ PostgreSQL configured
- ✅ JWT authentication
- ✅ 21 unit tests passing
- ✅ Procfile created
- ✅ gunicorn configured

---

## Deployment Options

### **Option 1: Render (RECOMMENDED)**

**Advantages**:
- Free tier available
- Auto-deploys from GitHub
- Built-in PostgreSQL database
- Easy environment variable setup
- Simple to scale

**Steps**:

#### 1. Initialize Git & Push to GitHub

```bash
# In /home/abhishek/Assign_intern directory
git init
git add -A
git config user.email "your-email@example.com"
git config user.name "Your Name"
git commit -m "Backend User Management API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/assign_intern.git
git push -u origin main
```

#### 2. Create Render Account & Deploy

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Fill in:
   - **Name**: `user-management-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app`

#### 3. Add Environment Variables

In Render dashboard, go to "Environment" and add:

```
FLASK_ENV=production
FLASK_APP=wsgi.py
SECRET_KEY=<generate-new-value>
JWT_SECRET_KEY=<generate-new-value>
DATABASE_URL=<will-be-provided-by-render>
CORS_ORIGINS=https://yourdomain.com
```

**Generate new secrets**:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### 4. Set Up PostgreSQL Database

In Render:
1. Go to "Database" → "Create New"
2. Select PostgreSQL
3. Copy the connection string to `DATABASE_URL`
4. Run migrations:
   - Click "Shell" in Render dashboard
   - Run: `flask db upgrade`

#### 5. Verify Deployment

```bash
# Check health endpoint
curl https://your-app-name.onrender.com/health

# Should return:
# {"status":"ok","service":"user-management-api"}
```

---

### **Option 2: Railway**

**Steps**:

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Select your repository
4. Railway auto-detects Python project
5. Add PostgreSQL plugin
6. Set environment variables (same as Render)
7. Deploy

---

### **Option 3: DigitalOcean App Platform**

1. Go to [digitalocean.com/products/app-platform](https://digitalocean.com/products/app-platform)
2. Connect GitHub
3. Select repository and branch
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

---

## Testing Deployed APIs

Once deployed, test your endpoints:

```bash
# Replace YOUR_APP_URL with actual deployed URL

# 1. Health Check
curl https://YOUR_APP_URL/health

# 2. Signup
curl -X POST https://YOUR_APP_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 3. Login
curl -X POST https://YOUR_APP_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 4. Get Current User (save token from login response)
curl https://YOUR_APP_URL/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'app'"
**Solution**: Ensure root directory in Render is set to `backend`

### Issue: "DATABASE_URL not set"
**Solution**: Add DATABASE_URL in environment variables

### Issue: "ImportError: cannot import name 'create_app'"
**Solution**: Check `wsgi.py` exists and `from app import create_app` is correct

### Issue: Database migrations not applied
**Solution**: In Render Shell, run:
```bash
python -c "from app import create_app, db; app = create_app(); db.create_all()"
```

---

## Quick Reference: Environment Variables

For any platform, set these:

```env
FLASK_ENV=production
FLASK_APP=wsgi.py
SECRET_KEY=<64-char-hex-string>
JWT_SECRET_KEY=<64-char-hex-string>
DATABASE_URL=postgresql+psycopg://user:password@host:5432/db
CORS_ORIGINS=https://yourdomain.com
```

---

## Verification Checklist

- [ ] Code pushed to GitHub
- [ ] Render/Railway project created
- [ ] Environment variables set
- [ ] PostgreSQL database created
- [ ] Database migrations applied (`flask db upgrade`)
- [ ] Health endpoint returns 200
- [ ] Signup endpoint accepts POST requests
- [ ] Login endpoint returns JWT token
- [ ] Authenticated endpoints require Authorization header

---

## Production Security Checklist

- [ ] `FLASK_ENV=production` set
- [ ] `SECRET_KEY` is strong random string (32+ chars)
- [ ] `JWT_SECRET_KEY` is strong random string (32+ chars)
- [ ] `.env` file NOT committed to Git
- [ ] `DEBUG=False` in production
- [ ] CORS_ORIGINS set to specific domain (not `*`)
- [ ] Database credentials in environment variables only
- [ ] HTTPS enforced (Render/Railway do this automatically)

---

## After Deployment

1. **Update CORS_ORIGINS** if you add frontend later:
   ```env
   CORS_ORIGINS=https://yourfrontend.com
   ```

2. **Scale as needed**:
   - Render: Adjust plan and instance count
   - Railway: Increase vCPU/RAM

3. **Monitor logs**:
   - Check Render/Railway logs for errors
   - Monitor database connections

4. **Seed test users** (optional):
   ```bash
   # In Render Shell:
   python seed_users.py
   ```

---

## API Documentation

All endpoints at: `https://YOUR_APP_URL/api`

### Auth Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout (stateless)

### User Endpoints
- `GET /api/users` - List all users (admin only)
- `POST /api/users/{id}/activate` - Activate user (admin only)
- `POST /api/users/{id}/deactivate` - Deactivate user (admin only)
- `GET /api/profile` - Get own profile
- `PUT /api/profile` - Update own profile
- `PUT /api/profile/password` - Change password

### Status Code Reference
- `200 OK` - Successful request
- `201 Created` - User created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Support

For issues:
1. Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. Check [SECURITY_AUDIT.md](backend/SECURITY_AUDIT.md)
3. Check backend logs on Render/Railway dashboard
4. Run tests locally: `pytest tests/test_api.py -v`

---

## Next Steps

1. **Choose platform**: Render (easiest) or Railway
2. **Push to GitHub**: Initialize git and push code
3. **Deploy**: Follow platform-specific steps
4. **Test APIs**: Use curl commands above
5. **Done!** Your APIs are live
