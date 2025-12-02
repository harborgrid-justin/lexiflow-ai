# User Impersonation Feature

## Overview

The User Impersonation feature allows developers to test the application from different user perspectives **using real users from the database**. This is crucial for testing role-based access control (RBAC) and user-specific features with actual production-like data.

## Location

**Component**: `/client/components/UserImpersonator.tsx`
**Integration**: Top-right header in `App.tsx`

## 🆕 Dynamic Features

### Real-Time Database Integration
- **Fetches live users** from `/api/v1/users` endpoint
- **Auto-loads on dropdown open** - users fetched when first opened
- **Refresh button** - manually reload user list to see latest changes
- **Loading states** - shows spinner while fetching
- **Error handling** - retry mechanism if fetch fails

### Instant DOM Updates
When a user is impersonated:
- ✅ **Sidebar menu items** update based on role permissions
- ✅ **User greeting** changes in header
- ✅ **Dashboard widgets** reflect user's access level
- ✅ **Case lists** filter to user's assigned cases
- ✅ **All components** using `useAuth()` hook update automatically

### 🔍 Search Functionality
- Search users by name, email, or role
- Real-time filtering
- Quick access to specific roles

### 🎨 Visual Indicators

#### Impersonation Button
- Purple/pink gradient button in header
- Crown icon (👑) for visibility
- Shows "Viewing as: [User Name]" when active

#### Active Impersonation Banner
- Full-width banner at top of screen
- Purple gradient background
- Shows current user and role
- "Exit Impersonation" button to return to original user

#### User List
- Color-coded role badges
- Avatar with user initials
- Office location indicator
- "Active" badge for currently selected user

## Usage

### How to Impersonate

1. Click the **"Impersonate User"** button in the top-right header
2. Search for a user (optional)
3. Click on any user to impersonate them
4. The UI updates immediately to show that user's perspective

### How to Exit Impersonation

**Method 1**: Click the "Exit Impersonation" button in the purple banner
**Method 2**: Click "X" or click outside the dropdown

### Testing Different Roles

#### Administrator
- Access to Admin Panel
- Full system permissions
- User management capabilities

#### Senior Partner / Partner
- Access to billing dashboards
- Case management
- Client relationship tools

#### Associate
- Case work and research
- Document management
- Limited administrative access

#### Paralegal
- Evidence management
- Document preparation
- Case support functions

#### Clerk
- Basic document access
- Limited case visibility

## Implementation Details

### AuthContext Updates

Added three new methods to `AuthContext`:
```typescript
impersonateUser: (user: User) => void;
stopImpersonating: () => void;
isImpersonating: boolean;
```

### State Management

- Original user is saved when impersonation starts
- Impersonated user replaces current user
- Can return to original user at any time
- Console logs track impersonation activity

### Security Considerations

**Development Only**: This feature is intended for development/testing
**No Backend Changes**: Impersonation is client-side only
**No Persistence**: Impersonation state is lost on page refresh
**Visual Warnings**: Purple banner clearly indicates developer mode

## Best Practices

### Testing Checklist

✅ Test each role can access appropriate features
✅ Verify restricted features are hidden for lower roles
✅ Check RBAC implementation in Sidebar
✅ Validate user-specific data displays correctly
✅ Confirm impersonation state resets on logout

### Common Test Scenarios

1. **Admin Panel Access**
   - Impersonate Administrator → Should see Admin Panel
   - Impersonate Associate → Should NOT see Admin Panel

2. **Billing Dashboard**
   - Impersonate Partner → Full billing access
   - Impersonate Paralegal → Limited or no access

3. **Case Management**
   - Different users see different case lists
   - Permissions vary by role

4. **Document Access**
   - Role-based document visibility
   - Upload/edit/delete permissions vary

## Keyboard Shortcuts

- **Click outside dropdown**: Close impersonator
- **Esc key**: Close dropdown (when focused)
- **Type to search**: Auto-focus search field

## Styling

- **Primary Color**: Purple (#9333ea) to Pink (#ec4899) gradient
- **Active State**: Purple background (#f3e8ff)
- **Role Badges**: Color-coded by role type
- **Banner**: Full-width sticky at top (z-index: 50)

## Future Enhancements

Potential improvements:
- [ ] Persist impersonation across page reloads
- [ ] Backend impersonation support
- [ ] Audit log of impersonation events
- [ ] Time-limited impersonation sessions
- [ ] Custom user creation for testing
- [ ] Export user test report

## Troubleshooting

**Issue**: Impersonation banner not showing
- **Fix**: Check `isImpersonating` state in AuthContext

**Issue**: Role permissions not updating
- **Fix**: Ensure components use `user` from AuthContext

**Issue**: Original user lost
- **Fix**: Refresh page to reset to actual logged-in user

## Code Example

```typescript
// Using impersonation in a component
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isImpersonating } = useAuth();
  
  return (
    <div>
      {isImpersonating && <p>Testing as {user?.name}</p>}
      <p>Role: {user?.role}</p>
    </div>
  );
};
```

---

**Last Updated**: November 30, 2024
**Feature Status**: ✅ Production Ready (Development Tool)
