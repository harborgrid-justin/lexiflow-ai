# Settings & Administration Feature

This feature provides comprehensive settings and administration capabilities for LexiFlow AI, including user preferences, organization settings, user management, and audit logging.

## 📁 Structure

```
features/settings/
├── api/
│   ├── settings.api.ts      # TanStack Query hooks for settings
│   ├── admin.api.ts          # TanStack Query hooks for admin
│   └── settings.types.ts     # TypeScript types
├── pages/
│   ├── SettingsPage.tsx      # User settings with tabs
│   ├── AdminPage.tsx         # Admin panel
│   └── IntegrationsPage.tsx  # Third-party integrations
├── store/
│   └── settings.store.ts     # Settings state management
├── index.ts                  # Exports
└── README.md                 # This file
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { SettingsPage, AdminPage } from '@/features/settings';

// In your routing/navigation
function App() {
  return (
    <Switch>
      <Route path="/settings" component={SettingsPage} />
      <Route path="/admin" component={AdminPage} />
    </Switch>
  );
}
```

### Using Settings Hooks

```tsx
import { useUserSettings, useUpdateUserSettings } from '@/features/settings';

function ProfileComponent() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const handleSave = () => {
    updateSettings.mutate({
      theme: 'dark',
      language: 'en',
    });
  };

  return (
    <div>
      <p>Theme: {settings?.theme}</p>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### Using Settings Store

```tsx
import { useTheme, settingsActions } from '@/features/settings';

function ThemeToggle() {
  const theme = useTheme();

  return (
    <button onClick={() => settingsActions.setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## 📝 Features

### User Settings Page

The Settings Page includes 5 tabs:

1. **Profile**
   - Avatar upload
   - Personal information (name, email, phone)
   - Job title and bar number
   - Email signature

2. **Preferences**
   - Theme selection (light/dark/system)
   - Language
   - Timezone
   - Date format
   - Default view

3. **Notifications**
   - Email notification toggles
   - In-app notification toggles
   - Digest frequency

4. **Security**
   - Change password
   - Two-factor authentication
   - Active sessions management
   - Login history

5. **Integrations**
   - API key management
   - Connected accounts
   - Calendar sync

### Admin Panel

The Admin Panel provides organization-level management:

1. **Organization Settings**
   - Firm information
   - Business address
   - Default billing rates
   - Practice areas and matter types

2. **User Management**
   - View all users
   - Invite new users
   - Edit user roles and status
   - Deactivate users
   - Resend invitations

3. **Roles & Permissions**
   - View system roles
   - Create custom roles
   - Permission matrix
   - Role assignment

4. **Billing**
   - Rate tables
   - Invoice templates
   - Payment integrations

5. **Audit Log**
   - All user actions
   - Filterable by user, action, date
   - Export to CSV

### Integrations Page

Manage third-party integrations:

- Email (Office 365, Gmail)
- Calendar (Outlook, Google Calendar)
- Cloud Storage (Dropbox, Box, OneDrive)
- Legal Tools (PACER, E-filing)
- Accounting (QuickBooks, Xero)

## 🔌 API Endpoints

### User Settings
- `GET /api/users/me/settings` - Get current user settings
- `PATCH /api/users/me/settings` - Update user settings
- `POST /api/users/me/avatar` - Upload avatar
- `POST /api/users/me/password` - Change password
- `POST /api/users/me/2fa/setup` - Setup 2FA
- `POST /api/users/me/2fa/enable` - Enable 2FA
- `POST /api/users/me/2fa/disable` - Disable 2FA
- `GET /api/users/me/sessions` - Get active sessions
- `DELETE /api/users/me/sessions/:id` - Revoke session
- `GET /api/users/me/api-keys` - Get API keys
- `POST /api/users/me/api-keys` - Create API key
- `DELETE /api/users/me/api-keys/:id` - Revoke API key

### Organization Settings
- `GET /api/organizations/settings` - Get organization settings
- `PATCH /api/organizations/settings` - Update organization settings

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users/invite` - Invite new user
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete/deactivate user
- `POST /api/admin/users/:id/resend-invitation` - Resend invitation
- `POST /api/admin/users/:id/reset-password` - Reset user password
- `GET /api/admin/roles` - List roles
- `POST /api/admin/roles` - Create role
- `PATCH /api/admin/roles/:id` - Update role
- `DELETE /api/admin/roles/:id` - Delete role
- `GET /api/admin/audit-log` - Get audit log
- `GET /api/admin/audit-log/export` - Export audit log
- `GET /api/admin/stats` - Get organization statistics

### Integrations
- `GET /api/integrations` - List available integrations
- `POST /api/integrations/connect` - Connect integration
- `DELETE /api/integrations/:type` - Disconnect integration

## 🎨 Theming

The settings store automatically applies theme changes to the DOM:

```tsx
// Theme is applied to document.documentElement
<html class="dark"> // or no class for light theme
```

You can use Tailwind's dark mode:

```tsx
<div className="bg-white dark:bg-slate-900">
  Content
</div>
```

## 🔒 Permissions

Use the Permission type to check user access:

```tsx
import type { Permission } from '@/features/settings';

const requiredPermissions: Permission[] = [
  'admin:settings',
  'admin:users',
];

function AdminButton({ userPermissions }: { userPermissions: Permission[] }) {
  const hasAccess = requiredPermissions.every(p => userPermissions.includes(p));

  if (!hasAccess) return null;

  return <button>Admin Action</button>;
}
```

## 🧪 Testing

### Mock Data

The feature includes mock integration data for development:

```tsx
import { mockIntegrations } from '@/features/settings/pages/IntegrationsPage';
```

### Test Utilities

```tsx
import { renderWithProviders } from '@/test-utils';
import { SettingsPage } from '@/features/settings';

test('renders settings page', () => {
  const { getByText } = renderWithProviders(<SettingsPage />);
  expect(getByText('Profile')).toBeInTheDocument();
});
```

## 📚 Type Definitions

### Key Types

- `UserSettings` - User preferences and settings
- `OrganizationSettings` - Organization-level settings
- `User` - User entity with role and permissions
- `Role` - Role with permissions
- `Permission` - String literal union of all permissions
- `AuditLogEntry` - Audit log entry
- `Integration` - Third-party integration

See `api/settings.types.ts` for complete type definitions.

## 🛠️ Customization

### Adding New Settings

1. Add type to `settings.types.ts`
2. Update API hooks in `settings.api.ts`
3. Add UI components in the appropriate tab
4. Update store if needed

### Adding New Permissions

1. Add to `Permission` type in `settings.types.ts`
2. Update backend permission checks
3. Use in UI components for access control

### Adding New Integrations

1. Add integration type to `IntegrationType`
2. Add backend connector
3. Integration card will automatically appear

## 🚧 Future Enhancements

- [ ] Custom role builder with drag-drop permissions
- [ ] Advanced audit log filtering and search
- [ ] Bulk user operations
- [ ] Custom notification channels (Slack, Teams)
- [ ] Advanced integration configurations
- [ ] Multi-factor authentication options
- [ ] Session management with device details
- [ ] Organization hierarchy support

## 📞 Support

For questions or issues, contact the development team or refer to the main LexiFlow documentation.
