# STEAKZ - Restaurant Management System

A full-stack restaurant management system built with React, TypeScript, Express, and Prisma.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (running locally or accessible via connection string)

### One-Command Startup (Recommended)

**On macOS/Linux:**
```bash
bash start-fullstack.sh
```

**On Windows:**
```bash
start-fullstack.bat
```

This will automatically:
- Install dependencies for both backend and frontend
- Start the PostgreSQL database (if configured)
- Launch the backend server on `http://localhost:3001`
- Launch the frontend on `http://localhost:5176`

---

## 📋 Manual Startup Guide

### Step 1: Install Dependencies

**Backend:**
```bash
cd steakz-backend
npm install
cd ..
```

**Frontend:**
```bash
cd MIS-PROJECT
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the `steakz-backend` directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/steakz_db"
JWT_SECRET="your-secret-key"
PORT=3001
```

### Step 3: Set Up Database

```bash
cd steakz-backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd steakz-backend
npm run dev
# Backend will run on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd MIS-PROJECT
npm run dev
# Frontend will run on http://localhost:5176
```

---

## 🔐 Default Login Credentials

The database is pre-seeded with test users. Use these credentials to log in:

| Role | Username | Email | Password |
|------|----------|-------|----------|
| **Admin** | admin | admin@restaurant.com | admin123 |
| **General Manager** | gm | gm@restaurant.com | gm123 |
| **Branch Manager** | bm | bm@restaurant.com | bm123 |

### How to Log In
1. Navigate to `http://localhost:5176`
2. Enter username or email
3. Enter password
4. Click "Login"

---

## 📁 Project Structure

```
MIS-FINAL/
├── MIS-PROJECT/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── context/             # Context API (Auth, Theme, Cart, Settings)
│   │   ├── services/            # API client
│   │   ├── types/               # TypeScript types
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── steakz-backend/              # Backend (Express + Prisma)
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   └── index.ts             # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Database seeding
│   └── package.json
│
├── start-fullstack.sh           # Linux/Mac startup script
├── start-fullstack.bat          # Windows startup script
└── README.md                    # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Static typing
- **Vite 5** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Context API** - State management (Auth, Theme, Cart, Settings)

### Backend
- **Node.js + Express** - Server framework
- **Prisma** - ORM for database
- **PostgreSQL** - Database
- **JWT** - Authentication
- **TypeScript** - Static typing

---

## 🎨 Design & Theme

### Color Scheme (Light Mode)
- **Primary Pink**: `#d81b60`, `#f06292`
- **Background**: `#fffafb` (soft white)
- **Accents**: Pastel pink variants

### Color Scheme (Dark Mode)
- **Primary Blue**: Marine/navy blue
- **Background**: Dark slate
- **Accents**: Ocean blue variants

### Typography
- **Body Font**: Quicksand
- **Heading Font**: Fredoka
- **UI Elements**: Clean, modern, and approachable

---

## 📱 Key Features

### For Customers
- Browse restaurant menu
- Place orders
- Track order status
- View order history
- Leave feedback and ratings
- Social posts & community engagement

### For Staff
- **Cashiers**: Process orders and payments
- **Kitchen**: Manage order preparation
- **General Manager**: Dashboard with analytics and reports
- **Branch Manager**: Manage specific branch operations

### For Admins
- User and staff management
- Restaurant & branch management
- Menu management
- Inventory tracking
- Sales reports and analytics
- System-wide dashboard

---

## 🔗 API Endpoints

The backend API runs on `http://localhost:3001` with the following main routes:

```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/reset-password     - Password reset
GET    /api/restaurants             - List all restaurants
GET    /api/restaurants/:id/menu    - Get restaurant menu
POST   /api/orders                  - Create new order
GET    /api/orders                  - Get user orders
PUT    /api/orders/:id              - Update order status
GET    /api/admin/dashboard         - Admin dashboard data
GET    /api/reports                 - Generate reports
```

For complete API documentation, see `DOCUMENTATION_INDEX.md`

---

## 🐛 Troubleshooting

### Backend Won't Start
- **Issue**: `DATABASE_URL not found`
  - **Solution**: Create `.env` file in `steakz-backend` with correct `DATABASE_URL`
  
- **Issue**: `Port 3001 already in use`
  - **Solution**: Kill the process on port 3001 or change `PORT` in `.env`

### Frontend Won't Start
- **Issue**: `Port 5176 already in use`
  - **Solution**: The script will try the next available port automatically
  
- **Issue**: `Module not found errors`
  - **Solution**: Run `npm install` in `MIS-PROJECT` directory

### Can't Log In
- **Issue**: `Invalid credentials`
  - **Solution**: Use the credentials from the table above. Default credentials are: `gm` / `gm123`
  
- **Issue**: Database not seeded
  - **Solution**: Run `npx prisma db seed` in `steakz-backend`

### Blank Page / Styling Issues
- **Solution**: 
  1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete on Mac)
  2. Run `npm run build` in `MIS-PROJECT`
  3. Restart frontend server

---

## 📝 Available Scripts

### Frontend (`MIS-PROJECT`)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (`steakz-backend`)
```bash
npm run dev      # Start with hot reload (nodemon)
npm run build    # Build TypeScript
npm start        # Start production server
```

---

## 📚 Additional Resources

- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Setup Guide**: See `SETUP_GUIDE.md` (in MIS-PROJECT)
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Branch Setup**: See `BRANCH_STAFF_SETUP.md`
- **Navigation Map**: See `NAVIGATION_MAP.md`

---

## 🚀 Deployment

### Build for Production

**Frontend:**
```bash
cd MIS-PROJECT
npm run build
# Creates optimized dist/ folder
```

**Backend:**
```bash
cd steakz-backend
npm run build
npm start
```

The frontend production build is ready to be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.).

---

## 📦 GitHub Repository

Project is hosted at: `https://github.com/nazaninhozhabr/STEAKZ-FINAL.git`

**To clone:**
```bash
git clone https://github.com/nazaninhozhabr/STEAKZ-FINAL.git
cd MIS-FINAL
bash start-fullstack.sh
```

---

## 👥 Project Team

- **Development**: Full-stack restaurant management system
- **Last Updated**: February 2026

---

## 📄 License

This project is proprietary and intended for educational/demonstration purposes.

---

## ✨ Features Highlight

✅ **Real-time Order Management** - Live order tracking and status updates  
✅ **Multi-Role System** - Admin, Manager, Staff, and Customer roles  
✅ **Beautiful UI** - Modern, responsive design with light and dark modes  
✅ **Complete Analytics** - Sales reports, inventory tracking, and performance metrics  
✅ **Social Features** - Community posts, feedback, and ratings  
✅ **Secure Authentication** - JWT-based authentication system  
✅ **Database Seeding** - Pre-populated test data for quick testing  

---

**Happy coding! 🍽️**
