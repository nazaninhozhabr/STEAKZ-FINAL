# Branch Staff Setup Guide

## Your Current Setup ✅

Your system **already supports** branch-specific staff! Here's how it works:

### Database Schema
```
User Model:
  - id
  - username, email, password
  - role: CHEF | CASHIER | BRANCH_MANAGER | CUSTOMER | ADMIN | GENERAL_MANAGER
  - branchId: Links staff to their branch
  
Branch Model:
  - id
  - name, address, phone
  - managerId: Links to branch manager
  - staff[]: Array of all staff assigned to this branch
```

### Branch Isolation (Already Implemented)
1. **JWT Token** includes `branchId` when user logs in
2. **getOrders()** automatically filters by `user.branchId` for CHEF, CASHIER, BRANCH_MANAGER
3. **updateOrderStatus()** blocks staff from updating orders outside their branch
4. **deleteOrder()** blocks branch managers from deleting orders outside their branch

---

## How to Create Staff for Each Branch

### Option 1: Using API Endpoints (Recommended)

#### 1. Create a CHEF for Branch 1
```bash
POST http://localhost:3001/api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "chef_branch1",
  "email": "chef1@steakz.com",
  "password": "SecurePass123!",
  "role": "CHEF",
  "branchId": 1
}
```

#### 2. Create a CASHIER for Branch 1
```bash
POST http://localhost:3001/api/users
Authorization: Bearer <admin_token>

{
  "username": "cashier_branch1",
  "email": "cashier1@steakz.com",
  "password": "SecurePass123!",
  "role": "CASHIER",
  "branchId": 1
}
```

#### 3. Create a BRANCH_MANAGER for Branch 1
```bash
POST http://localhost:3001/api/users
Authorization: Bearer <admin_token>

{
  "username": "manager_branch1",
  "email": "manager1@steakz.com",
  "password": "SecurePass123!",
  "role": "BRANCH_MANAGER",
  "branchId": 1
}
```

#### Repeat for Other Branches
- Branch 2: `chef_branch2`, `cashier_branch2`, `manager_branch2` with `branchId: 2`
- Branch 3: `chef_branch3`, `cashier_branch3`, `manager_branch3` with `branchId: 3`
- And so on...

---

### Option 2: Using Database Seed Script

Create staff directly in the database seed file:

```typescript
// In prisma/seed.ts

// Branch 1 Staff
const chef1 = await prisma.user.create({
  data: {
    username: 'chef_branch1',
    email: 'chef1@steakz.com',
    password: await bcrypt.hash('SecurePass123!', 10),
    role: 'CHEF',
    branchId: 1
  }
});

const cashier1 = await prisma.user.create({
  data: {
    username: 'cashier_branch1',
    email: 'cashier1@steakz.com',
    password: await bcrypt.hash('SecurePass123!', 10),
    role: 'CASHIER',
    branchId: 1
  }
});

const manager1 = await prisma.user.create({
  data: {
    username: 'manager_branch1',
    email: 'manager1@steakz.com',
    password: await bcrypt.hash('SecurePass123!', 10),
    role: 'BRANCH_MANAGER',
    branchId: 1
  }
});

// Branch 2 Staff
const chef2 = await prisma.user.create({
  data: {
    username: 'chef_branch2',
    email: 'chef2@steakz.com',
    password: await bcrypt.hash('SecurePass123!', 10),
    role: 'CHEF',
    branchId: 2
  }
});
// ... repeat for other Branch 2 staff
```

Then run: `npm run seed`

---

## Testing Branch Isolation

### Test Scenario: Chef from Branch 1 vs Branch 2

#### Step 1: Create test orders in different branches
```bash
# Order for Branch 1
POST http://localhost:3001/api/orders
{
  "branchId": 1,
  "items": [{"menuItemId": 1, "quantity": 2}]
}
# Returns: Order ID = 101, branchId = 1

# Order for Branch 2
POST http://localhost:3001/api/orders
{
  "branchId": 2,
  "items": [{"menuItemId": 1, "quantity": 1}]
}
# Returns: Order ID = 102, branchId = 2
```

#### Step 2: Login as Branch 1 Chef
```bash
POST http://localhost:3001/api/auth/login
{
  "email": "chef1@steakz.com",
  "password": "SecurePass123!"
}
# Returns: JWT token with branchId = 1
```

#### Step 3: Try to access orders
```bash
# Get all orders (should only see Branch 1 orders)
GET http://localhost:3001/api/orders
Authorization: Bearer <chef1_token>
# ✅ Returns: Only Order 101 (Branch 1)
# ❌ Does NOT show: Order 102 (Branch 2)

# Try to update Branch 2 order (should fail)
PUT http://localhost:3001/api/orders/102
Authorization: Bearer <chef1_token>
{
  "status": "PREPARING"
}
# ❌ Returns: 403 Unauthorized - "You can only update orders from your branch"
```

#### Step 4: Login as Branch 2 Chef
```bash
POST http://localhost:3001/api/auth/login
{
  "email": "chef2@steakz.com",
  "password": "SecurePass123!"
}
```

```bash
GET http://localhost:3001/api/orders
Authorization: Bearer <chef2_token>
# ✅ Returns: Only Order 102 (Branch 2)
# ❌ Does NOT show: Order 101 (Branch 1)
```

---

## Quick Setup Commands

### 1. Check existing branches
```bash
GET http://localhost:3001/api/branches
```

### 2. Check existing users
```bash
GET http://localhost:3001/api/users
Authorization: Bearer <admin_token>
```

### 3. Create staff via API (use Postman/Thunder Client/curl)
```bash
# Login as admin first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Use the token to create staff
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "username":"chef_downtown",
    "email":"chef.downtown@steakz.com",
    "password":"SecurePass123!",
    "role":"CHEF",
    "branchId":1
  }'
```

---

## Summary

✅ **Already Working:**
- Each user has `branchId` field linking them to their branch
- JWT tokens include `branchId` 
- Order filtering by branch for staff roles
- Update/delete operations validate branch ownership

✅ **What You Need to Do:**
1. Create staff users with appropriate roles (CHEF, CASHIER, BRANCH_MANAGER)
2. Assign each staff member to their branch via `branchId`
3. Test by logging in as different staff and verifying they only see their branch's orders

✅ **Result:**
- Chef from Branch 1 will ONLY see/update orders from Branch 1
- Chef from Branch 2 will ONLY see/update orders from Branch 2
- Same isolation applies to Cashiers and Branch Managers
