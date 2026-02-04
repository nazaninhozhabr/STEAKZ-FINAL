# 🔗 Frontend-Backend Integration Complete Guide

## ✅ Status: FULLY CONNECTED AND READY

Your MIS Project frontend and steakz-backend are fully integrated and ready for development!

---

## 📋 Quick Integration Summary

| Component | Status | Details |
|-----------|--------|---------|
| **Backend Server** | ✅ Ready | Express running on port 3001 |
| **Frontend Build** | ✅ Ready | React+Vite on port 5176 |
| **Database** | ✅ Ready | PostgreSQL with Prisma ORM |
| **API Client** | ✅ Configured | Axios with auto-token injection |
| **CORS** | ✅ Enabled | Frontend URL whitelisted |
| **JWT Auth** | ✅ Setup | Token stored in localStorage |
| **Environment** | ✅ Configured | `.env` files in place |

---

## 🚀 Start Your Full-Stack Application

### **Fastest Way (2 steps):**

**Step 1: Start Backend**
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/steakz-backend
npm run dev
```

**Step 2: Start Frontend (new terminal)**
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/MIS-PROJECT
npm run dev
```

**Step 3: Open Browser**
```
http://localhost:5176
```

---

## 🔌 How They're Connected

### **1. Network Communication**

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  React Browser (localhost:5176)                          │
│  ├─ App.tsx                                              │
│  ├─ src/services/api.ts (Axios Client)                 │
│  └─ localStorage (JWT token storage)                    │
│           │                                              │
│           │ HTTP/CORS                                   │
│           │                                              │
│  Express Server (localhost:3001)                         │
│  ├─ src/index.ts (Entry point)                          │
│  ├─ src/routes/* (API endpoints)                        │
│  ├─ src/controllers/* (Business logic)                  │
│  └─ src/middleware/authMiddleware.ts (JWT validation)  │
│           │                                              │
│           │ SQL/ORM                                     │
│           │                                              │
│  PostgreSQL Database (localhost:5432)                   │
│  └─ steakz-db (Your data)                               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### **2. Data Flow Example: User Login**

```javascript
// 1. User clicks "Login" in React
// 2. Frontend calls API:
const response = await api.post('/auth/login', {
  username: 'john_doe',
  password: 'password123'
});

// 3. Request Flow:
//    a) Axios client at src/services/api.ts:
//       - Base URL: http://localhost:3001
//       - Content-Type: application/json
//       - Adds Authorization header (if token exists)
//    
//    b) HTTP POST to: http://localhost:3001/auth/login
//       - CORS check passes (frontend URL is whitelisted)
//    
//    c) Backend receives at src/routes/authRoutes.ts
//       - Calls authController.login()
//       - Validates credentials
//       - Queries database via Prisma
//    
//    d) Response: { token: "jwt...", user: {...} }
//    
//    e) Frontend stores token in localStorage
//    
// 4. Future requests auto-include:
//    Authorization: Bearer <token>
```

### **3. Request/Response Flow**

```
Frontend Request → Backend Process → Database Query → Response → Frontend Update
     ↓                 ↓                   ↓               ↓           ↓
  Axios         Express Router         Prisma         JSON         setState
  with token    + Middleware           Query          Response      Update UI
```

---

## 🔑 Configuration Details

### **Backend Configuration** (`steakz-backend/src/index.ts`)

```typescript
// CORS allows these origins:
const allowedOrigins = [
  'http://localhost:5176',      // ✅ Your frontend
  'http://localhost:3000',      // Alternative dev port
  'https://steakz-final-frontend.onrender.com', // Production
  process.env.FRONTEND_URL      // Env variable
];

// Middleware setup:
app.use(express.json());        // Parse JSON bodies
app.use(cors({...}));           // Enable CORS
app.use(authMiddleware);        // Protect routes
```

### **Frontend Configuration** (`MIS-PROJECT/src/services/api.ts`)

```typescript
// Axios instance:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject token:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Environment Setup** (Already Configured)

**Backend** `.env`:
```dotenv
# Database connection
DATABASE_URL=postgresql://nazanin:nazi1@localhost:5432/steakz-db?schema=public

# JWT secret for token generation
JWT_SECRET=any_random_string_here_make_it_long

# Optional: frontend URL
FRONTEND_URL=http://localhost:5176
```

**Frontend** `.env`:
```dotenv
# API server URL
VITE_API_URL=http://localhost:3001
```

---

## 📊 Available API Endpoints

All endpoints are accessible from your frontend via the configured API client:

### **Authentication** (`/auth`)
```
POST   /auth/signup              - Register new user
POST   /auth/login               - Login user
POST   /auth/request-reset       - Request password reset
POST   /auth/reset-password      - Reset password
```

### **User Management** (`/api/users`)
```
GET    /api/users                - Get all users
GET    /api/users/:id            - Get user by ID
PUT    /api/users/:id            - Update user
DELETE /api/users/:id            - Delete user
```

### **Menu Management** (`/api/menu` or `/api/menu-items`)
```
GET    /api/menu                 - Get all menu items
GET    /api/menu/:id             - Get menu item
POST   /api/menu                 - Create menu item
PUT    /api/menu/:id             - Update menu item
DELETE /api/menu/:id             - Delete menu item
```

### **Order Management** (`/api/orders`)
```
GET    /api/orders               - Get all orders
GET    /api/orders/:id           - Get order details
POST   /api/orders               - Create order
PUT    /api/orders/:id           - Update order
```

### **Inventory** (`/api/inventory`)
```
GET    /api/inventory            - Get inventory items
PUT    /api/inventory/:id        - Update inventory
```

### **Branch Management** (`/api/branches`)
```
GET    /api/branches             - Get all branches
POST   /api/branches             - Create branch
PUT    /api/branches/:id         - Update branch
```

### **Staff Management** (`/api/staff`)
```
GET    /api/staff                - Get all staff
POST   /api/staff                - Add staff member
PUT    /api/staff/:id            - Update staff
DELETE /api/staff/:id            - Remove staff
```

### **More Endpoints Available**
- `/api/admin-dashboard` - Dashboard data
- `/api/branch-dashboard` - Branch analytics
- `/api/payments` - Payment processing
- `/api/receipts` - Receipt management
- `/api/posts` - Customer reviews
- `/api/comments` - Review comments
- `/api/categories` - Menu categories
- `/api/data-export` - Export data

---

## 💻 Using API from React Components

### **Example 1: Fetch Data**

```typescript
// In a React component
import { getOrders } from '@/services/api';
import { useEffect, useState } from 'react';

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>{order.id}: {order.status}</li>
      ))}
    </ul>
  );
}
```

### **Example 2: Create Data**

```typescript
// Create new order
import { createOrder } from '@/services/api';

async function placeOrder() {
  try {
    const newOrder = await createOrder({
      items: [
        { menuItemId: 1, quantity: 2 },
        { menuItemId: 3, quantity: 1 }
      ]
    });
    console.log('Order created:', newOrder);
  } catch (error) {
    console.error('Failed to create order:', error);
  }
}
```

### **Example 3: Authentication**

```typescript
// Login
import { login } from '@/services/api';

async function handleLogin(username, password) {
  try {
    const response = await login(username, password);
    // Token is automatically stored in localStorage
    // Future requests will include it automatically
    console.log('Logged in as:', response.user.username);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

---

## 🧪 Testing the Integration

### **Test 1: Verify Backend is Responding**

```bash
curl http://localhost:3001
# Expected: "Welcome to the Restaurant Management API!"
```

### **Test 2: Check CORS is Working**

In browser console (at http://localhost:5176):
```javascript
fetch('http://localhost:3001')
  .then(r => r.text())
  .then(console.log);
// Should print: "Welcome to the Restaurant Management API!"
```

### **Test 3: Test Authentication Flow**

In browser console:
```javascript
// Login
const loginRes = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});
const data = await loginRes.json();
console.log(data); // { token: "...", user: {...} }

// Save token
localStorage.setItem('token', data.token);

// Use token in request
const userRes = await fetch('http://localhost:3001/api/users', {
  headers: {
    'Authorization': `Bearer ${data.token}`
  }
});
const users = await userRes.json();
console.log(users);
```

### **Test 4: Check Network in DevTools**

1. Open http://localhost:5176 in browser
2. Open DevTools → Network tab
3. Perform an action (login, fetch data, etc.)
4. You should see requests to `http://localhost:3001`
5. Check:
   - ✅ Status: 200 (success)
   - ✅ Authorization header is present
   - ✅ Response contains expected data

---

## 🐛 Common Issues & Solutions

### **Issue: "Cannot connect to backend"**

**Symptoms:**
- Network errors in console
- "fetch failed" or similar messages

**Solutions:**
1. Verify backend is running: `curl http://localhost:3001`
2. Check `.env` file has correct `VITE_API_URL`
3. Ensure both servers use correct ports (frontend: 5176, backend: 3001)
4. Restart both servers

### **Issue: "CORS error"**

**Symptoms:**
- "Access to XMLHttpRequest blocked by CORS"
- "The value of the Access-Control-Allow-Credentials..."

**Solutions:**
1. Verify frontend URL in backend CORS config
2. Check that `http://localhost:5176` is in allowed origins
3. Restart backend server

### **Issue: "401 Unauthorized"**

**Symptoms:**
- Protected routes return 401
- "Invalid token" errors

**Solutions:**
1. Ensure you're logged in first
2. Check token in localStorage: `localStorage.getItem('token')`
3. Try logging in again
4. Check token expiration if applicable

### **Issue: "Database connection error"**

**Symptoms:**
- Backend crashes with "connect ECONNREFUSED"
- Prisma connection errors

**Solutions:**
1. Verify PostgreSQL is running: `brew services list`
2. Check `DATABASE_URL` in `.env`
3. Verify credentials are correct
4. Run migrations: `npx prisma migrate dev`

### **Issue: "Port already in use"**

**Symptoms:**
- "EADDRINUSE" error
- "Address already in use"

**Solutions:**
```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>

# Find and kill process on port 5176
lsof -i :5176
kill -9 <PID>
```

---

## 📝 Development Workflow

1. **Start both servers**
   ```bash
   ./start-fullstack.sh  # or manual terminals
   ```

2. **Make changes to either frontend or backend**
   - Frontend: Changes automatically reload via Vite
   - Backend: Changes reload via nodemon

3. **Test your changes**
   - Check browser for UI updates
   - Check Network tab for API calls
   - Check browser console for errors

4. **Use DevTools effectively**
   - **Network tab**: See API requests/responses
   - **Console tab**: See errors and logs
   - **Application tab**: View localStorage (JWT token)
   - **Response tab**: See API response data

5. **Debug as needed**
   - Add `console.log` statements
   - Use breakpoints in DevTools
   - Check backend server logs

---

## 🚢 Deployment

When deploying to production:

1. **Update Frontend `.env.production`:**
   ```dotenv
   VITE_API_URL=https://your-api-domain.com
   ```

2. **Update Backend Environment:**
   ```dotenv
   DATABASE_URL=postgresql://prod-user:pass@prod-host/prod-db
   JWT_SECRET=<strong-random-string>
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Build Frontend:**
   ```bash
   npm run build
   ```

4. **Deploy Backend** and **Serve Frontend** builds

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `MIS-PROJECT/src/services/api.ts` | Frontend API client |
| `MIS-PROJECT/.env` | Frontend config |
| `steakz-backend/src/index.ts` | Backend entry point |
| `steakz-backend/src/middleware/authMiddleware.ts` | JWT validation |
| `steakz-backend/.env` | Backend config |
| `steakz-backend/prisma/schema.prisma` | Database schema |

---

## ✅ Checklist Before Starting Development

- [ ] PostgreSQL is running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` files are configured
- [ ] Backend server started (`npm run dev` on port 3001)
- [ ] Frontend server started (`npm run dev` on port 5176)
- [ ] Browser opens to http://localhost:5176
- [ ] Can see requests in Network tab going to http://localhost:3001
- [ ] No CORS or network errors in console

---

## 🎉 You're All Set!

Your full-stack application is completely integrated and ready for development. Start building amazing features! 

For more help, refer to:
- `CONNECTION_SETUP.md` - Detailed technical setup
- `QUICK_START.md` - Quick reference guide

**Happy coding! 🚀**
