# Frontend-Backend Connection Setup Guide

## ✅ Connection Status: READY

Your MIS frontend is already configured to communicate with your steakz-backend. Here's the complete setup breakdown:

---

## 📋 Project Configuration

### Backend (steakz-backend)
- **Framework**: Express.js
- **Port**: 3001
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT
- **Location**: `/Users/nazanin/Desktop/MIS-FINAL/steakz-backend`

### Frontend (MIS-PROJECT)
- **Framework**: React + Vite
- **Port**: 5176 (development)
- **API Client**: Axios
- **Location**: `/Users/nazanin/Desktop/MIS-FINAL/MIS-PROJECT`

---

## 🔗 Connection Configuration

### Backend CORS Setup (Already Configured)
Located in `steakz-backend/src/index.ts`:
```typescript
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5176',      // Your frontend dev port
      'http://localhost:3000',      // Alternative dev port
      'https://steakz-final-frontend.onrender.com', // Production
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### Frontend API Configuration (Already Configured)
Located in `MIS-PROJECT/src/services/api.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic JWT token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Environment Variables (Already Configured)

**Frontend** `.env`:
```dotenv
VITE_API_URL=http://localhost:3001
```

**Backend** `.env`:
```dotenv
DATABASE_URL=postgresql://nazanin:nazi1@localhost:5432/steakz-db?schema=public
JWT_SECRET=any_random_string_here_make_it_long
```

---

## 🚀 Quick Start

### 1. Start PostgreSQL Database
```bash
# Make sure PostgreSQL is running
# On macOS with Homebrew:
brew services start postgresql@15
```

### 2. Setup Backend
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/steakz-backend

# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Backend will run on: `http://localhost:3001`

### 3. Setup Frontend
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/MIS-PROJECT

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5176`

---

## 🔌 Available API Endpoints

Your backend exposes the following endpoint groups (all prefixed with `http://localhost:3001`):

| Endpoint | Purpose |
|----------|---------|
| `/auth/*` | Login, Signup, Password Reset |
| `/api/users/*` | User Management |
| `/api/staff/*` | Staff Management |
| `/api/branches/*` | Branch Operations |
| `/api/branch-dashboard/*` | Branch Dashboard Data |
| `/api/menu/*` | Menu Management |
| `/api/menu-items/*` | Menu Items (alias) |
| `/api/inventory/*` | Inventory Tracking |
| `/api/orders/*` | Order Processing |
| `/api/payments/*` | Payment Handling |
| `/api/admin-dashboard/*` | Admin Dashboard |
| `/api/categories/*` | Menu Categories |
| `/api/receipts/*` | Receipt Management |
| `/api/posts/*` | Customer Reviews/Feedback |
| `/api/comments/*` | Comments on Reviews |
| `/api/data-export/*` | Data Export |

---

## 🔐 Authentication Flow

1. **User Login**: Frontend sends credentials to `/auth/login`
2. **JWT Token**: Backend returns `{ token, user }`
3. **Token Storage**: Frontend stores token in `localStorage`
4. **Auto-Inject**: Axios interceptor automatically adds token to all requests
5. **Protected Routes**: Backend middleware validates token on protected endpoints

---

## ✨ Frontend API Usage

All API functions are already defined in `src/services/api.ts`:

```typescript
// Authentication
import { login, signup, logout } from './services/api';

// Users
import { getUser, getUserList } from './services/api';

// Orders
import { createOrder, getOrders, updateOrderStatus } from './services/api';

// Inventory
import { getInventory, updateInventory } from './services/api';

// And many more...
```

---

## 🧪 Testing the Connection

### Test with cURL (Backend Running)
```bash
# Test backend health
curl http://localhost:3001

# Expected response: "Welcome to the Restaurant Management API!"
```

### Test Login Flow
```bash
# 1. Create account (if needed)
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Response should contain: { "token": "...", "user": {...} }
```

---

## 🛠️ Troubleshooting

### Frontend Can't Connect to Backend
**Symptoms**: Network errors, CORS errors
**Solutions**:
1. Ensure backend is running on port 3001
2. Check `VITE_API_URL` in `.env`
3. Verify CORS allowed origins in backend

### Database Connection Issues
**Symptoms**: Database connection errors
**Solutions**:
1. Verify PostgreSQL is running: `brew services list`
2. Check DATABASE_URL in backend `.env`
3. Run migrations: `npx prisma migrate dev`

### Token Not Being Sent
**Symptoms**: 401 Unauthorized on protected routes
**Solutions**:
1. Login first to get token
2. Check token in browser DevTools → Application → Local Storage
3. Verify axios interceptor is working in Network tab

### CORS Errors
**Symptoms**: "Not allowed by CORS" error
**Solutions**:
1. Ensure frontend URL is in CORS allowed origins
2. Check that requests include credentials if needed
3. Verify backend is running

---

## 📦 Key Dependencies

**Backend**:
- `express` - Web framework
- `@prisma/client` - ORM
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `bcrypt` - Password hashing
- `dotenv` - Environment variables

**Frontend**:
- `react` - UI framework
- `vite` - Build tool
- `axios` - HTTP client
- `react-router-dom` - Routing

---

## 🎯 Next Steps

1. **Start both servers** (backend on 3001, frontend on 5176)
2. **Navigate to** `http://localhost:5176` in your browser
3. **Test login** with the authentication flow
4. **Check browser console** for any errors
5. **Monitor Network tab** to see API requests

---

## 📝 Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **JWT Explained**: https://jwt.io/
- **Axios Docs**: https://axios-http.com/

---

**Your frontend-backend connection is ready! Start both servers and you're good to go.** ✅
