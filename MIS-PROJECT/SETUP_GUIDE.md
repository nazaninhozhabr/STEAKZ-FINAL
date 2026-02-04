# MIS Project - Frontend + Backend Connection Guide

## Setup Steps

### 1. Install Backend Dependencies
```bash
cd legacy-backend
npm install
```

### 2. Environment Files Created

**Frontend (.env):**
- `/.env` → Development (uses `http://localhost:3001`)
- `/.env.production` → Production (replace with your domain)

**Backend (.env):**
- `/legacy-backend/.env` → Development config
- `/legacy-backend/.env.production` → Production config

### 3. Start Backend
```bash
cd legacy-backend
npm run dev  # Runs on http://localhost:3001
```

### 4. Start Frontend
```bash
npm run dev  # Runs on http://localhost:5173
```

## How It Works

### Frontend → Backend Flow:

1. **Frontend** (`src/services/api.ts`) calls an API function:
   ```typescript
   createOrder({
     branchId: 1,
     items: [{ menuItemId: 5, quantity: 2 }],
     deliveryAddress: "123 Main St"
   })
   ```

2. **Frontend API instance** sends HTTP POST to backend:
   ```
   POST http://localhost:3001/api/orders
   Authorization: Bearer <token>
   Content-Type: application/json
   ```

3. **Backend** receives request, validates, and saves to database:
   ```typescript
   app.post('/api/orders', (req, res) => {
     // Save to database
     // Return order with ID
   })
   ```

4. **Backend responses** come back to frontend, UI updates

## Important Environment Variables

### Backend (.env)
- `DATABASE_URL` → Connection string (PostgreSQL, MySQL, or SQLite)
- `JWT_SECRET` → Token signing key (CHANGE IN PRODUCTION!)
- `FRONTEND_URL` → Frontend origin for CORS
- `PORT` → Server port (default: 3001)

### Frontend (.env)
- `VITE_API_URL` → Backend API URL

## Database Connection Examples

### PostgreSQL (Recommended)
```
DATABASE_URL=postgresql://username:password@localhost:5432/mis_project
```

### MySQL
```
DATABASE_URL=mysql://username:password@localhost:3306/mis_project
```

### SQLite (Simple, local)
```
DATABASE_URL=sqlite:./data.db
```

## Testing API Endpoints

Use Postman or curl:

```bash
# Create Order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "branchId": 1,
    "items": [{"menuItemId": 5, "quantity": 2}],
    "deliveryAddress": "123 Main St"
  }'

# Update Order Status
curl -X PATCH http://localhost:3001/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "completed"}'

# Process Payment
curl -X POST http://localhost:3001/api/payments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount": 100, "method": "credit_card"}'
```

## Next Steps

1. **Connect Database**: Update `/legacy-backend/.env` with your DB connection
2. **Implement Endpoints**: Replace TODO comments in `/legacy-backend/src/index.ts` with actual DB queries
3. **Authentication**: Ensure JWT tokens are validated on protected routes
4. **Testing**: Run frontend + backend locally and test the order flow

## Debugging Tips

- Check browser Console (Frontend) for errors
- Check terminal output (Backend) for server logs
- Verify CORS is enabled (check browser Network tab)
- Ensure `FRONTEND_URL` in backend .env matches your frontend URL
