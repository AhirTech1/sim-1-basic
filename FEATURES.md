# Student Premium Portal - Admin Panel Features

## Overview
The Student Premium Portal has been enhanced with role-based access control and an admin dashboard. The system supports two user roles: **Student** and **Admin**.

---

## Features Implemented

### 1. User Roles
- **Student Role**: Regular users with access to free and premium study materials
- **Admin Role**: Platform administrators with access to user management and statistics

### 2. Authentication System

#### Student Login
- Any username and password are accepted
- Students are logged in as regular users with `userRole: 'student'`
- Example: Username: `john`, Password: `anything`

#### Admin Login
- Hidden condition check in JavaScript (client-side only)
- Admin credentials are checked by comparing:
  - **Username**: `admin`
  - **Password**: `admin123` (stored in hidden input with ID `admin-secret`)
- Example: Username: `admin`, Password: `admin123`

**Security Note**: This is a trusted environment for demonstration. Credentials are checked on the client side only.

### 3. State Management

All session data is stored in localStorage:
```javascript
{
  isLoggedIn: boolean,      // Login status
  username: string,         // User's name
  userRole: 'student'|'admin', // User role
  isPremium: boolean        // Premium status (students only)
}
```

### 4. Student Dashboard
When a student logs in, they see:
- **Header** with welcome message and user status badge
- **Upgrade Prompt**: Banner to upgrade to premium
- **Free Study Materials**: Accessible to all users
- **Premium Study Materials**: Locked by default, unlocked upon upgrade
- **Logout Button**: To end the session

**Premium Access**: Students can click "Upgrade to Premium" to unlock all content.

### 5. Admin Dashboard
When an admin logs in, they see:

#### Platform Statistics (Mock Data)
- **1,234** Total Users
- **342** Premium Members
- **892** Free Students
- **98%** Engagement Rate

#### User Management Table
A table displaying all users with columns:
- **Username**: User's account name
- **Status**: Active/Inactive status badge
- **Premium**: Yes/No indicator
- **Action**: Toggle Premium button

Admins can:
- View all registered users (mock data)
- Toggle premium access on/off for any user
- See user engagement status
- Access fake but realistic statistics

### 6. Access Control
- **UI-based**: Views are hidden/shown using JavaScript
- **CSS Classes**: Views have `hidden` class set via JavaScript
- **No Backend**: All logic is client-side only
- **No Encryption**: Credentials are checked in plain text (trusted environment)

### 7. Session Persistence
- User sessions are saved to localStorage
- On page reload, users remain logged in with their role and preferences
- Logout clears the session from localStorage

---

## File Changes

### index.html
- Added hidden `admin-secret` input for admin credentials
- Added admin dashboard section with:
  - Statistics cards
  - User management table
  - Admin header with logout button

### style.css
- Added admin dashboard styling:
  - `.stat-card` - Statistics display cards
  - `.admin-table-container` - Table wrapper with glassmorphism
  - `.admin-table` - Styled data table
  - Status badges (active/inactive)
  - Premium badges (yes/no)
  - Action buttons with hover effects

### script.js
- Complete rewrite with role-based system:
  - Added `userRole` to state
  - Added `isAdminLogin()` function for admin credential checking
  - Added `renderAdminUserTable()` function for user management
  - Updated `updateUI()` to handle three views (login, student, admin)
  - Added admin logout handler
  - Added mock user database with 6 sample users
  - Comprehensive comments throughout

---

## How to Test

### Test Student Login
1. Username: Any string (e.g., `john`, `alice`)
2. Password: Any string (e.g., `password`, `123`)
3. Expected: Student dashboard appears with upgrade option

### Test Admin Login
1. Username: `admin`
2. Password: `admin123`
3. Expected: Admin dashboard appears with user management table

### Test Premium Upgrade (Student)
1. Log in as a student
2. Click "Upgrade to Premium" button
3. Confirm the upgrade dialog
4. Expected: Premium materials unlock, badge appears in header

### Test User Management (Admin)
1. Log in as admin
2. View the user management table
3. Click "Grant Premium" or "Remove Premium" buttons
4. Expected: User premium status toggles in real-time

### Test Session Persistence
1. Log in as any user (student or admin)
2. Refresh the page (Ctrl+R or F5)
3. Expected: User remains logged in with same role and preferences

### Test Logout
1. Click the "Log Out" button in the header
2. Expected: Returned to login screen, session cleared from localStorage

---

## Technical Details

### Admin Credentials Check
```javascript
const isAdminLogin = (username, password) => {
    const adminSecret = document.getElementById('admin-secret').value;
    return username.toLowerCase() === 'admin' && password === adminSecret;
};
```

### Mock User Database
```javascript
let mockUsers = [
    { id: 1, username: 'john_doe', status: 'active', isPremium: true },
    { id: 2, username: 'jane_smith', status: 'active', isPremium: false },
    // ... more users
];
```

### Role-Based View Logic
```javascript
if (!state.isLoggedIn) {
    // Show login view
} else if (state.userRole === 'admin') {
    // Show admin dashboard
} else {
    // Show student dashboard
}
```

---

## Design Principles Applied

1. **Simplicity**: Code is straightforward and easy to understand
2. **Readability**: Comprehensive comments explain each section
3. **Maintainability**: Clear function names and logical organization
4. **Security Note**: Designed for a trusted environment (no sensitive data handling)
5. **Extensibility**: Easy to add more users, features, or roles in the future

---

## Notes

- ✅ No backend or server-side code required
- ✅ No database or API calls
- ✅ No encryption or complex security measures (trusted environment)
- ✅ All logic runs on the client side
- ✅ Session data persists using localStorage
- ✅ Admin and student UI elements are hidden by default
- ✅ Clean, readable, and well-commented code
