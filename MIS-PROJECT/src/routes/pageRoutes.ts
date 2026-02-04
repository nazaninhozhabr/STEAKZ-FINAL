
export interface PageRoute {
  path: string;
  label: string;
}

export const pageRoutes: PageRoute[] = [
  { path: '/', label: 'Home' },
  { path: '/login', label: 'Login' },
  { path: '/signup', label: 'Signup' },
  { path: '/user-list', label: 'User List' },
  { path: '/staff', label: 'Staff Management' },
  { path: '/branches', label: 'Branch Management' },
  { path: '/menu', label: 'Menu Management' },
  { path: '/kitchen', label: 'Kitchen Dashboard' },
  // Add more routes here as you add new pages
];