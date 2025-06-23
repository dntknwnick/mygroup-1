# Role-Based Authentication System

A React application with role-based authentication supporting three user roles: Super Admin, Corporate, and Branch users.

## Features

- **Role-based Authentication**: Three distinct user roles with different permissions
- **Responsive Design**: Built with React-Bootstrap for mobile-friendly interface
- **Protected Routes**: Role-based route protection and automatic redirection
- **User Management**: Super Admin can create Corporate users, Corporate users can create Branch users
- **Dashboard Views**: Customized dashboards for each user role

## User Roles

### Super Admin
- **Username**: `superadmin`
- **Password**: `admin123`
- **Capabilities**: 
  - Create Corporate user accounts
  - View all Corporate users
  - Access system-wide statistics

### Corporate
- **Username**: `corporate1`
- **Password**: `corp123`
- **Capabilities**:
  - Create Branch user accounts
  - View all Branch users under their management
  - Access corporate-level reports

### Branch
- **Username**: `branch1`
- **Password**: `branch123`
- **Capabilities**:
  - Access branch-specific dashboard
  - View transaction history
  - Process banking operations
  - Update profile information

## Installation

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Navigate to project directory**:
   ```bash
   cd role-based-auth
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
role-based-auth/
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Login form component
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── ProtectedRoute.jsx     # Route protection component
│   │   ├── SuperAdminDashboard.jsx # Super Admin dashboard
│   │   ├── CorporateDashboard.jsx  # Corporate dashboard
│   │   └── BranchDashboard.jsx     # Branch dashboard
│   ├── contexts/
│   │   └── AuthContext.jsx        # Authentication context and state management
│   ├── App.jsx                    # Main application component with routing
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

## How It Works

1. **Authentication Flow**:
   - Users log in with username/password
   - System validates credentials and determines user role
   - Users are automatically redirected to their role-specific dashboard

2. **Role-Based Access**:
   - Each route is protected based on user roles
   - Unauthorized access attempts redirect to appropriate dashboard
   - Navigation menu adapts based on user permissions

3. **User Management**:
   - Super Admin creates Corporate users
   - Corporate users create Branch users
   - All user data is stored in context (in production, this would be a backend database)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **React-Bootstrap** - UI component library
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool and development server

## Demo Credentials

Use these credentials to test different user roles:

| Role | Username | Password |
|------|----------|----------|
| Super Admin | superadmin | admin123 |
| Corporate | corporate1 | corp123 |
| Branch | branch1 | branch123 |

## Future Enhancements

- Backend API integration
- Real database storage
- Password encryption
- Email verification
- Advanced user permissions
- Audit logging
- Multi-factor authentication
