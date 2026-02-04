# 🚀 MIS Project Quick Start Guide

## ✅ Your Frontend-Backend Connection is Ready!

Your React frontend and Express backend are fully configured and ready to communicate.

---

## 🎯 Quickest Way to Start

### **Option 1: Automatic Startup (Recommended)**

**On macOS/Linux:**
```bash
cd /Users/nazanin/Desktop/MIS-FINAL
./start-fullstack.sh
```

**On Windows:**
```bash
cd C:\Users\nazanin\Desktop\MIS-FINAL
start-fullstack.bat
```

Then open your browser to: **http://localhost:5176**

---

### **Option 2: Manual Startup (Terminal)**

**Terminal 1 - Backend:**
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/steakz-backend
npm install        # First time only
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/nazanin/Desktop/MIS-FINAL/MIS-PROJECT
npm install        # First time only
npm run dev
```

Then open your browser to: **http://localhost:5176**

---

## 📍 Server Addresses

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5176 | Your React app |
| Backend | http://localhost:3001 | API server |
| Database | localhost:5432 | PostgreSQL |

---

## 🔍 What's Connected

✅ **Backend is listening for frontend requests**
- CORS configured for `http://localhost:5176`
- JWT authentication ready
- All API endpoints available

✅ **Frontend is configured to send requests to backend**
- Axios client setup at `src/services/api.ts`
- Base URL: `http://localhost:3001`
- Auto-token injection in headers

✅ **Database is ready**
- PostgreSQL running
- Prisma migrations in place
- Schema defined in `prisma/schema.prisma`

---

## 🧪 Test Your Connection

### In Your Browser Console (http://localhost:5176):

```javascript
// Open DevTools → Console and run:

// Test 1: Check API URL
console.log(import.meta.env.VITE_API_URL)
// Should show: http://localhost:3001

// Test 2: Make a test request
const response = await fetch('http://localhost:3001')
console.log(await response.text())
// Should show: Welcome to the Restaurant Management API!
```

### Via Terminal:

```bash
# Test backend is running
curl http://localhost:3001

# Expected output: Welcome to the Restaurant Management API!
```

---

## 🔐 Testing Authentication

### 1. **Create an Account** (in browser or via API)

Go to: **http://localhost:5176/signup**

Or via cURL:
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. **Login**

Go to: **http://localhost:5176/login**

Or via cURL:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "CUSTOMER"
  }
}
```

### 3. **Check Token in Browser**

DevTools → Application → Local Storage → Look for `token` key

---

## 📊 Available API Endpoints

All requests go to `http://localhost:3001/api/` or `http://localhost:3001/auth/`

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/request-reset` - Request password reset
- `POST /auth/reset-password` - Reset password

**Core Features:**
- `/api/users` - User management
- `/api/menu` - Menu management
- `/api/orders` - Order management
- `/api/inventory` - Inventory tracking
- `/api/branches` - Branch operations
- `/api/staff` - Staff management
- `/api/admin-dashboard` - Admin analytics
- `/api/posts` - Customer reviews

---

## 🐛 Troubleshooting

### ❌ "Cannot GET /"
- Backend is not running
- Check: `http://localhost:3001`
- Solution: Run `npm run dev` in backend folder

### ❌ "Network Error" or "CORS Error"
- Backend CORS not allowing frontend URL
- Check: Backend `.env` and `index.ts` CORS config
- Solution: Ensure `http://localhost:5176` is in allowed origins

### ❌ "401 Unauthorized"
- No token or expired token
- Solution: Login again, token will be saved to localStorage

### ❌ Database Connection Error
- PostgreSQL not running
- Check: `brew services list` (macOS)
- Solution: Start PostgreSQL: `brew services start postgresql@15`

### ❌ Port Already in Use
- Another process using port 3001 or 5176
- Solution: 
  ```bash
  # Kill process on port 3001
  lsof -ti:3001 | xargs kill -9
  # Kill process on port 5176
  lsof -ti:5176 | xargs kill -9
  ```

---

## 📁 Project Structure

```
MIS-FINAL/
├── MIS-PROJECT/              # React Frontend
│   ├── src/
│   │   ├── services/api.ts   # Axios API client (configured!)
│   │   ├── types/            # TypeScript types
│   │   ├── pages/            # React pages
│   │   └── context/          # React context
│   ├── .env                  # Frontend config (VITE_API_URL set!)
│   └── package.json
│
├── steakz-backend/           # Express Backend
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth & CORS
│   │   └── index.ts          # Server entry (CORS configured!)
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env                  # Backend config (DB & JWT)
│   └── package.json
│
└── CONNECTION_SETUP.md       # Detailed setup guide
```

---

## 🎓 How Frontend Calls Backend

**Example: Getting user list**

1. **Frontend code** (`MIS-PROJECT/src/services/api.ts`):
```typescript
export const getUserList = async () => {
  const response = await api.get('/users');
  return response.data;
};
```

2. **Frontend usage** (in a React component):
```typescript
const users = await getUserList();
```

3. **Axios automatically adds:**
   - Base URL: `http://localhost:3001`
   - JWT token: `Authorization: Bearer <token>`
   - Content-Type: `application/json`

4. **Request sent to:** `http://localhost:3001/api/users`

5. **Backend receives and processes** (`steakz-backend/src/routes/userRoutes.ts`)

6. **Response returned** with data or error

---

## 🔑 Environment Variables

Your `.env` files are already configured:

**Frontend** (MIS-PROJECT/.env):
```dotenv
VITE_API_URL=http://localhost:3001
```

**Backend** (steakz-backend/.env):
```dotenv
DATABASE_URL=postgresql://nazanin:nazi1@localhost:5432/steakz-db?schema=public
JWT_SECRET=any_random_string_here_make_it_long
```

---

## 📚 Next Steps

1. ✅ Start both servers (use `./start-fullstack.sh`)
2. ✅ Test login at `http://localhost:5176/login`
3. ✅ Create some test data
4. ✅ Check browser Network tab to see API requests
5. ✅ Build your features!

---

## 💡 Pro Tips

- **DevTools Network Tab**: See all API requests/responses
- **DevTools Console**: Check for errors and debug
- **DevTools Application**: View stored JWT token
- **Backend Console**: See server logs and errors
- **Postman**: Test API endpoints directly

---

## 🆘 Need Help?

Check the full documentation: See `CONNECTION_SETUP.md` in this directory

---

**Your full-stack application is ready to rock! 🎸**
