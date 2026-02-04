# 🔧 Frontend-Backend Integration - Troubleshooting & Debugging

## 📋 Pre-Launch Checklist

Before starting your application, verify everything:

### Database
- [ ] PostgreSQL installed and running
  ```bash
  brew services list | grep postgres
  ```
- [ ] Connection string correct in `.env`
  ```bash
  psql postgresql://nazanin:nazi1@localhost:5432/steakz-db
  ```
- [ ] Prisma migrations applied
  ```bash
  cd steakz-backend && npx prisma migrate dev
  ```

### Backend
- [ ] Dependencies installed
  ```bash
  cd steakz-backend && npm install
  ```
- [ ] Port 3001 is free
  ```bash
  lsof -i :3001
  ```
- [ ] `.env` has DATABASE_URL and JWT_SECRET
  ```bash
  grep -E "DATABASE_URL|JWT_SECRET" steakz-backend/.env
  ```

### Frontend
- [ ] Dependencies installed
  ```bash
  cd MIS-PROJECT && npm install
  ```
- [ ] Port 5176 is free
  ```bash
  lsof -i :5176
  ```
- [ ] `.env` has VITE_API_URL
  ```bash
  grep VITE_API_URL MIS-PROJECT/.env
  ```

---

## 🚀 Startup Verification

### Step 1: Start Backend

```bash
cd steakz-backend
npm run dev
```

**Expected Output:**
```
🚀 Restaurant Management API Server running on http://localhost:3001
📋 Available endpoints:
   - Authentication: /auth/*
   - Users: /api/users/*
   ...
✅ Admin user seeding completed
```

**If you see errors:**
- ❌ `Error: connect ECONNREFUSED` → PostgreSQL not running
- ❌ `Port 3001 already in use` → Kill process: `lsof -ti:3001 | xargs kill -9`
- ❌ `Cannot find module` → Run `npm install`

### Step 2: Start Frontend (new terminal)

```bash
cd MIS-PROJECT
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  build x.x.x

  ➜  Local:   http://localhost:5176/
  ➜  press h + enter to show help
```

**If you see errors:**
- ❌ `Port 5176 already in use` → Kill process: `lsof -ti:5176 | xargs kill -9`
- ❌ `Cannot find module` → Run `npm install`

### Step 3: Verify Connection

```bash
# Test backend is responding
curl http://localhost:3001
# Should see: "Welcome to the Restaurant Management API!"

# In browser (http://localhost:5176), open Console and run:
fetch('http://localhost:3001')
  .then(r => r.text())
  .then(console.log)
```

---

## 🔍 Debugging Connection Issues

### Issue 1: Frontend Can't Connect to Backend

**Symptoms:**
```
GET http://localhost:3001/api/users - Failed to fetch
CORS error in console
Network errors in DevTools
```

**Debug Steps:**

1. **Check backend is running:**
   ```bash
   curl -v http://localhost:3001
   ```
   - Should return 200 OK

2. **Check VITE_API_URL in frontend:**
   ```bash
   grep VITE_API_URL MIS-PROJECT/.env
   # Should see: VITE_API_URL=http://localhost:3001
   ```

3. **Verify CORS in browser:**
   ```javascript
   // In browser console
   fetch('http://localhost:3001', {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' }
   }).then(r => console.log('Status:', r.status))
   ```

4. **Check backend logs:**
   - Look for CORS error messages
   - Verify origin is whitelisted

5. **Firewall check:**
   ```bash
   # Check if ports are accessible
   nc -zv localhost 3001
   nc -zv localhost 5176
   ```

**Solutions:**
- Restart backend: `npm run dev` in steakz-backend
- Clear browser cache: Cmd+Shift+Delete in Chrome
- Check ports: `lsof -i :3001` and `lsof -i :5176`
- Verify network: Try `curl http://localhost:3001/api/users` with token

---

### Issue 2: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:3001/api/...' 
from origin 'http://localhost:5176' has been blocked by CORS policy
```

**Debug Steps:**

1. **Check CORS configuration:**
   ```bash
   grep -A 10 "app.use(cors" steakz-backend/src/index.ts
   ```

2. **Verify frontend URL is whitelisted:**
   - Should see `http://localhost:5176` in allowed origins

3. **Check request headers:**
   - Open DevTools → Network tab
   - Click on request
   - Check if `Access-Control-Allow-Origin` header is present

4. **Test with curl:**
   ```bash
   curl -H "Origin: http://localhost:5176" \
        -H "Access-Control-Request-Method: GET" \
        http://localhost:3001/api/users
   ```

**Solutions:**
- Add frontend URL to CORS whitelist in backend
- Restart backend after changes
- Clear browser cache

---

### Issue 3: Authentication Not Working

**Symptoms:**
```
401 Unauthorized on protected routes
Login doesn't save token
JWT errors in console
```

**Debug Steps:**

1. **Check token is saved after login:**
   ```javascript
   // In browser console
   localStorage.getItem('token')
   // Should return JWT string, not null
   ```

2. **Verify token format:**
   ```javascript
   // Should have 3 parts separated by dots
   const token = localStorage.getItem('token');
   console.log(token.split('.').length); // Should be 3
   ```

3. **Check JWT_SECRET in backend:**
   ```bash
   grep JWT_SECRET steakz-backend/.env
   ```

4. **Test login endpoint:**
   ```bash
   curl -X POST http://localhost:3001/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"admin123"}'
   ```

5. **Check if token is sent in headers:**
   - DevTools → Network → Click request
   - Headers section → Authorization header
   - Should see: `Authorization: Bearer <token>`

**Solutions:**
- Login again
- Clear localStorage: `localStorage.clear()`
- Verify credentials
- Check JWT_SECRET is set in backend
- Ensure authMiddleware is properly validating tokens

---

### Issue 4: Database Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Prisma error: Can't reach database server
PrismaClientInitializationError
```

**Debug Steps:**

1. **Check PostgreSQL is running:**
   ```bash
   brew services list | grep postgres
   # Should see 'postgres ... started'
   ```

2. **Verify connection string:**
   ```bash
   grep DATABASE_URL steakz-backend/.env
   # Should be: postgresql://nazanin:nazi1@localhost:5432/steakz-db
   ```

3. **Test database connection:**
   ```bash
   psql postgresql://nazanin:nazi1@localhost:5432/steakz-db
   # Should connect to database
   ```

4. **Check database exists:**
   ```bash
   psql postgres -U nazanin -c "\\l" | grep steakz
   ```

5. **Check Prisma connection:**
   ```bash
   cd steakz-backend && npx prisma db push
   ```

**Solutions:**
- Start PostgreSQL: `brew services start postgresql@15`
- Verify credentials in DATABASE_URL
- Create database if missing: `createdb steakz-db`
- Reset Prisma: `npx prisma db push --skip-generate`

---

### Issue 5: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3001
Port 5176 already in use
```

**Debug Steps:**

1. **Find process using port:**
   ```bash
   lsof -i :3001  # For backend port
   lsof -i :5176  # For frontend port
   ```

2. **Check what process it is:**
   ```bash
   ps aux | grep node
   ```

**Solutions:**
```bash
# Kill specific port
lsof -ti:3001 | xargs kill -9   # Kill backend port
lsof -ti:5176 | xargs kill -9   # Kill frontend port

# Or kill all node processes (use carefully!)
killall node

# Or use different ports
npm run dev -- --port 3002     # Backend on different port
npm run dev -- --port 5177     # Frontend on different port
```

---

### Issue 6: Changes Not Reflecting

**Symptoms:**
```
Made changes but app doesn't update
Changes in backend not reflected
Frontend changes not showing
```

**Debug Steps:**

1. **For frontend:**
   - Check Vite is running (should show "press h + enter to show help")
   - Look for compilation errors in terminal
   - Check browser refresh: Cmd+R or Cmd+Shift+R

2. **For backend:**
   - Check nodemon is running (should watch files)
   - Verify file was actually saved
   - Check for syntax errors

3. **Check file is being saved:**
   ```bash
   ls -la steakz-backend/src/index.ts  # Check timestamp
   ```

**Solutions:**
- Restart development servers
- Clear browser cache: Cmd+Shift+Delete
- Check for TypeScript errors
- Save file explicitly
- Restart Vite/nodemon

---

## 🧪 Advanced Debugging

### Enable Debug Logging

**Backend:**
```bash
# Add to backend/src/index.ts before routes
console.log('🔍 Debug mode enabled');
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});
```

**Frontend:**
```typescript
// Add to MIS-PROJECT/src/services/api.ts
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);
```

### Browser DevTools

**Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, fetch, etc.)
4. Click request to see:
   - Headers (Authorization, CORS)
   - Request body (what you sent)
   - Response (what server returned)
   - Status (200, 401, 404, 500, etc.)

**Console Tab:**
```javascript
// Check API_URL
console.log('API_URL:', import.meta.env.VITE_API_URL);

// Check token
console.log('Token:', localStorage.getItem('token'));

// Check Axios interceptor
console.log('Axios defaults:', api.defaults);
```

**Application Tab:**
- Local Storage: See stored JWT token
- Cookies: Check session data
- Network Condition: Simulate offline/slow network

### Backend Logs

Check terminal where backend is running:
```
GET /api/users
POST /auth/login
Error: [error message]
```

### Database Queries

```bash
# Check what's in database
psql steakz-db -U nazanin

# List all tables
\dt

# See users
SELECT * FROM "User";

# See orders
SELECT * FROM "Order";
```

---

## 📊 Monitoring Requests

### Real-time Request Monitoring

**In browser console:**
```javascript
// Log all API requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🔗 Fetch:', args[0], args[1]);
  return originalFetch.apply(this, args);
};
```

### Network Traffic

```bash
# Monitor network on port 3001 (macOS)
sudo tcpdump -i lo0 port 3001
```

---

## ✅ Full Integration Test

Run this checklist to ensure everything works:

```bash
# 1. Backend health
curl http://localhost:3001
# ✓ Should return welcome message

# 2. Database connection
cd steakz-backend && npx prisma db execute --stdin < /dev/null
# ✓ Should not error

# 3. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# ✓ Should return token

# 4. Protected endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/users
# ✓ Should return user list

# 5. CORS from frontend
# Open http://localhost:5176 in browser and test
```

---

## 🚨 Emergency Fixes

**Everything is broken - start fresh:**
```bash
# Kill all processes
killall node
killall -9 node

# Clear dependencies
cd steakz-backend && rm -rf node_modules && npm install
cd ../MIS-PROJECT && rm -rf node_modules && npm install

# Reset database
dropdb steakz-db
createdb steakz-db
cd steakz-backend && npx prisma migrate dev

# Restart everything
./start-fullstack.sh
```

---

## 📞 Still Having Issues?

### Collect Debug Information

```bash
# Save system info
echo "=== System ===" > debug-info.txt
node --version >> debug-info.txt
npm --version >> debug-info.txt
postgres --version >> debug-info.txt

# Save backend config
echo "=== Backend ===" >> debug-info.txt
cat steakz-backend/.env >> debug-info.txt
cat steakz-backend/package.json | grep '"version"' >> debug-info.txt

# Save frontend config
echo "=== Frontend ===" >> debug-info.txt
cat MIS-PROJECT/.env >> debug-info.txt

# Save error logs
echo "=== Errors ===" >> debug-info.txt
# Copy error messages from terminal
```

---

**Need more help? Check the other guide files:**
- `QUICK_START.md` - Quick reference
- `CONNECTION_SETUP.md` - Detailed setup
- `INTEGRATION_GUIDE.md` - Complete integration guide

**You've got this! 💪**
