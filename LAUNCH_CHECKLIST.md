# ✅ Frontend-Backend Integration Checklist

## 🎯 Pre-Launch Verification

Use this checklist to verify everything is working before you start development.

---

## ✅ System Requirements

- [ ] **Node.js installed**
  ```bash
  node --version  # Should show v18+
  ```

- [ ] **npm installed**
  ```bash
  npm --version  # Should show v9+
  ```

- [ ] **PostgreSQL installed and running**
  ```bash
  brew services list | grep postgres  # Should show "started"
  ```

- [ ] **Git available** (for version control)
  ```bash
  git --version
  ```

---

## ✅ Project Files

### Backend Files
- [ ] `steakz-backend/.env` exists with:
  - [ ] `DATABASE_URL` set correctly
  - [ ] `JWT_SECRET` defined
  - [ ] `FRONTEND_URL` set (optional)

- [ ] `steakz-backend/src/index.ts` contains:
  - [ ] Express app created
  - [ ] CORS middleware configured
  - [ ] Routes mounted
  - [ ] Server listening on port 3001

- [ ] `steakz-backend/prisma/schema.prisma` exists:
  - [ ] Database provider set to PostgreSQL
  - [ ] Models defined (User, Order, MenuItem, etc.)

### Frontend Files
- [ ] `MIS-PROJECT/.env` exists with:
  - [ ] `VITE_API_URL=http://localhost:3001`

- [ ] `MIS-PROJECT/src/services/api.ts` exists with:
  - [ ] Axios instance created
  - [ ] Base URL from environment variable
  - [ ] Request interceptor for token injection

- [ ] `MIS-PROJECT/src/types/index.ts` exists:
  - [ ] API response types defined

---

## ✅ Environment Configuration

### Backend Configuration
```bash
cd steakz-backend
```

- [ ] **Database connection test:**
  ```bash
  psql postgresql://nazanin:nazi1@localhost:5432/steakz-db -c "SELECT 1"
  # Should return: "1"
  ```

- [ ] **Dependencies installed:**
  ```bash
  ls node_modules | grep express  # Should find "express"
  ```

- [ ] **Environment variables loaded:**
  ```bash
  grep DATABASE_URL .env  # Should show your DB URL
  ```

### Frontend Configuration
```bash
cd ../MIS-PROJECT
```

- [ ] **Environment variable set:**
  ```bash
  grep VITE_API_URL .env  # Should show URL
  ```

- [ ] **Dependencies installed:**
  ```bash
  ls node_modules | grep axios  # Should find "axios"
  ```

---

## ✅ Port Availability

- [ ] **Port 3001 is free** (backend):
  ```bash
  lsof -i :3001  # Should return nothing or not "LISTEN"
  ```

- [ ] **Port 5176 is free** (frontend):
  ```bash
  lsof -i :5176  # Should return nothing or not "LISTEN"
  ```

---

## ✅ Database Setup

### Prisma Migrations
```bash
cd steakz-backend
```

- [ ] **Migrations exist:**
  ```bash
  ls prisma/migrations/
  # Should show directories like "20260128231958_init_steakz"
  ```

- [ ] **Database schema applied:**
  ```bash
  npx prisma db push
  # Should complete without errors
  ```

- [ ] **Prisma client generated:**
  ```bash
  npx prisma generate
  # Should complete without errors
  ```

### Database Verification
- [ ] **Tables exist in database:**
  ```bash
  psql steakz-db -U nazanin -c "\\dt"
  # Should show tables: User, Order, MenuItem, etc.
  ```

- [ ] **Seed data (if applicable):**
  ```bash
  npx prisma db seed  # If seed.ts exists
  # Should create default admin user
  ```

---

## ✅ Startup Tests

### Start Backend
```bash
cd steakz-backend
npm run dev
```

Verify in terminal output:
- [ ] "🚀 Restaurant Management API Server running on http://localhost:3001"
- [ ] "✅ Admin user seeding completed"
- [ ] No error messages

Quick check:
```bash
curl http://localhost:3001
# Should return: "Welcome to the Restaurant Management API!"
```

### Start Frontend (new terminal)
```bash
cd MIS-PROJECT
npm run dev
```

Verify in terminal output:
- [ ] "Local: http://localhost:5176/"
- [ ] No error messages
- [ ] "press h + enter to show help"

Visit in browser:
- [ ] Open http://localhost:5176
- [ ] Page loads without errors
- [ ] No console errors (F12 → Console tab)

---

## ✅ Connection Tests

### Browser Console Test
Open http://localhost:5176, press F12, go to Console:

```javascript
// Test 1: Check API URL
console.log(import.meta.env.VITE_API_URL)
// Should print: http://localhost:3001
```

✓ Passes if: Shows correct URL

```javascript
// Test 2: Test backend connectivity
fetch('http://localhost:3001')
  .then(r => r.text())
  .then(console.log)
// Should print: "Welcome to the Restaurant Management API!"
```

✓ Passes if: Welcome message appears

```javascript
// Test 3: Check localStorage
console.log(localStorage.getItem('token'))
// Should print: null (or JWT if already logged in)
```

✓ Passes if: No error

### Network Tab Test
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Refresh page (Cmd+R)
- [ ] Look for requests to http://localhost:3001
- [ ] Check requests show status 200 or 304

---

## ✅ Authentication Test

### Login Flow Test

1. [ ] **Navigate to login page**
   - Go to http://localhost:5176/login (or signup)
   - Page loads without errors

2. [ ] **Create test account** (if needed)
   - Fill in form
   - Submit
   - Check DevTools → Network → Request to /auth/signup
   - Status should be 200-201

3. [ ] **Test login**
   - Enter credentials
   - Submit form
   - Check DevTools → Network → Request to /auth/login
   - Status should be 200
   - Response should include "token" field

4. [ ] **Verify token stored**
   ```javascript
   // In browser console
   localStorage.getItem('token')
   // Should return JWT string starting with "eyJ..."
   ```

5. [ ] **Verify token sent in requests**
   - DevTools → Network
   - Any request to /api/* endpoints
   - Headers tab → Authorization
   - Should show: "Bearer eyJ..."

---

## ✅ API Endpoints Test

### Test Specific Endpoints

**Example: Get Users**
```bash
# Get your token first from localStorage
TOKEN=$(node -e "console.log('eyJ...')")  # Paste your token

# Test endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3001/api/users
# Should return user list
```

- [ ] `/auth/login` - ✅ Returns token
- [ ] `/auth/signup` - ✅ Creates user
- [ ] `/api/users` - ✅ Returns users
- [ ] `/api/orders` - ✅ Returns orders
- [ ] `/api/menu` - ✅ Returns menu items

---

## ✅ CORS Test

### Verify CORS is Working

```javascript
// In browser console at http://localhost:5176
fetch('http://localhost:3001/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => console.log('Status:', r.status))
.catch(e => console.error('CORS Error:', e))
// Should print: "Status: 401" (not CORS error)
```

✓ Passes if: No CORS error (might get 401 if no token, but not CORS blocked)

---

## ✅ Database Test

### Verify Database Connectivity

```bash
# Test connection to database
psql steakz-db -U nazanin -c "SELECT COUNT(*) FROM \"User\";"
# Should return a number (count of users)
```

✓ Passes if: Returns a number without error

### Check Prisma can Query Database

```bash
cd steakz-backend
npx prisma studio
# Should open http://localhost:5555 with database viewer
# Click on any table to see data
```

✓ Passes if: Can see tables and data

---

## ✅ Build Test

### Frontend Build

```bash
cd MIS-PROJECT
npm run build
```

- [ ] No errors in output
- [ ] `dist/` folder created
- [ ] Files in dist/: index.html, js files, css files

```bash
# Test build locally
npm run preview
# Should show: "Local: http://localhost:4173/" (or similar)
```

✓ Passes if: Preview opens without errors

### Backend Build

```bash
cd ../steakz-backend
npm run build
```

- [ ] No errors in output
- [ ] `dist/` folder created with .js files

```bash
# Test production build
node dist/index.js
# Should start server without errors
```

✓ Passes if: Server starts and shows welcome message

---

## ✅ Error Handling Test

### Test 401 (Unauthorized)

1. [ ] Try to access protected endpoint without token:
   ```bash
   curl http://localhost:3001/api/users
   # Should return 401
   ```

2. [ ] Response should be error message (not 500)

### Test Invalid Token

```bash
curl -H "Authorization: Bearer invalid_token" \
     http://localhost:3001/api/users
# Should return 401
```

✓ Passes if: Returns 401, not 500

### Test 404 (Not Found)

```bash
curl http://localhost:3001/invalid-endpoint
# Should return 404
```

✓ Passes if: Returns 404, not 500

---

## ✅ Performance Check

### Frontend Load Time
- [ ] Open http://localhost:5176
- [ ] DevTools → Performance
- [ ] Record page load
- [ ] First Contentful Paint: < 3 seconds
- [ ] Largest Contentful Paint: < 5 seconds

### API Response Time
- [ ] DevTools → Network
- [ ] Perform API call
- [ ] Check "Time" column
- [ ] Should be < 1 second (for simple queries)

### Database Query Time
```bash
cd steakz-backend
# Enable query logging in Prisma
export DEBUG="prisma:client"
npm run dev
```

- [ ] Queries should complete in < 100ms

---

## ✅ Security Checklist

### CORS Security
- [ ] Only whitelisted origins can access API
- [ ] Check: `steakz-backend/src/index.ts`

### JWT Security
- [ ] JWT_SECRET is strong (not "default")
- [ ] Tokens are stored in localStorage (http-only would be better)
- [ ] Token is sent in Authorization header

### Password Security
- [ ] Passwords are hashed (check bcrypt usage)
- [ ] No passwords in console logs

### HTTPS (For Production)
- [ ] [ ] Will use HTTPS in production
- [ ] [ ] Will update VITE_API_URL to https://...

---

## ✅ Deployment Readiness

### Frontend Ready for Deployment
- [ ] [ ] `npm run build` completes without errors
- [ ] [ ] Dist folder contains all files
- [ ] [ ] Environment variables for production set
- [ ] [ ] No console errors or warnings

### Backend Ready for Deployment
- [ ] [ ] `npm run build` completes without errors
- [ ] [ ] Can start with `node dist/index.js`
- [ ] [ ] Database migrations applied
- [ ] [ ] Environment variables for production set
- [ ] [ ] No console errors or warnings

### Database Ready
- [ ] [ ] Backup created
- [ ] [ ] Migrations tested on production DB
- [ ] [ ] Indexes created for performance

---

## 📋 Final Sign-Off

- [ ] All system requirements met
- [ ] All configuration files in place
- [ ] Database setup complete
- [ ] Both servers start without errors
- [ ] Frontend loads in browser
- [ ] Backend responds to requests
- [ ] CORS working
- [ ] Authentication working
- [ ] Token injection working
- [ ] All endpoints tested
- [ ] No console errors
- [ ] Build test passed
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security basics verified

---

## 🎉 You're Ready!

If you've checked all boxes, your frontend-backend integration is **production-ready**!

### Next Steps:
1. ✅ Start both servers
2. ✅ Begin development
3. ✅ Deploy when ready

---

## 🆘 Something Failed?

Go to `TROUBLESHOOTING.md` for specific solutions.

**Happy building!** 🚀
