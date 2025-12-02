/**
 * LexiFlow AI Design System - Usage Examples
 *
 * This file contains real-world examples of how to use the design system components.
 * Copy and adapt these examples for your own use cases.
 */

import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  Textarea,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Progress,
  Skeleton,
  ToastProvider,
  useToast,
  Command,
  Calendar,
} from './index';
import {
  SearchInput,
  DataTable,
  EmptyState,
  ErrorBoundary,
  LoadingScreen,
  Breadcrumbs,
} from '../index';
import { User, Search, Settings, Mail, Lock, Eye } from '../icons';

// Example 1: Login Form
export function LoginFormExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          leftIcon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Checkbox
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" variant="primary">
          Sign In
        </Button>
        <Button className="w-full" variant="ghost">
          Forgot password?
        </Button>
      </CardFooter>
    </Card>
  );
}

// Example 2: User Profile
export function UserProfileExample() {
  const [notifications, setNotifications] = useState(true);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar
            src="/avatar.jpg"
            name="John Doe"
            size="xl"
            status="online"
          />
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>john.doe@example.com</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Switch
          label="Email Notifications"
          description="Receive email updates about your cases"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
        <div className="flex gap-2">
          <Badge variant="success">Verified</Badge>
          <Badge variant="primary">Pro Plan</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" leftIcon={<Settings className="h-4 w-4" />}>
          Account Settings
        </Button>
      </CardFooter>
    </Card>
  );
}

// Example 3: Data Table with Cases
export function CasesTableExample() {
  const cases = [
    { id: '1', caseNumber: 'C-2024-001', client: 'Acme Corp', status: 'Active', date: '2024-01-15' },
    { id: '2', caseNumber: 'C-2024-002', client: 'Smith LLC', status: 'Pending', date: '2024-01-20' },
    { id: '3', caseNumber: 'C-2024-003', client: 'Johnson Inc', status: 'Closed', date: '2024-01-25' },
  ];

  const columns = [
    {
      id: 'caseNumber',
      header: 'Case Number',
      accessor: 'caseNumber' as const,
      sortable: true,
    },
    {
      id: 'client',
      header: 'Client',
      accessor: 'client' as const,
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status' as const,
      cell: (row: typeof cases[0]) => (
        <Badge
          variant={
            row.status === 'Active'
              ? 'success'
              : row.status === 'Pending'
              ? 'warning'
              : 'default'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
    },
  ];

  return (
    <DataTable
      data={cases}
      columns={columns}
      selectable
      pagination
      pageSize={10}
      onRowClick={(row) => console.log('Clicked:', row)}
    />
  );
}

// Example 4: Toast Notifications
export function ToastExample() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          addToast({
            title: 'Success',
            description: 'Your changes have been saved',
            variant: 'success',
          })
        }
      >
        Success Toast
      </Button>
      <Button
        onClick={() =>
          addToast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'error',
          })
        }
      >
        Error Toast
      </Button>
      <Button
        onClick={() =>
          addToast({
            title: 'Info',
            description: 'New update available',
            variant: 'info',
            action: {
              label: 'Update',
              onClick: () => console.log('Update clicked'),
            },
          })
        }
      >
        Info Toast with Action
      </Button>
    </div>
  );
}

// Example 5: Command Palette
export function CommandPaletteExample() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      id: '1',
      label: 'Search Cases',
      value: 'search-cases',
      icon: <Search className="h-4 w-4" />,
      group: 'Actions',
      onSelect: () => console.log('Search cases'),
    },
    {
      id: '2',
      label: 'New Case',
      value: 'new-case',
      group: 'Actions',
      onSelect: () => console.log('New case'),
    },
    {
      id: '3',
      label: 'Settings',
      value: 'settings',
      icon: <Settings className="h-4 w-4" />,
      group: 'Navigation',
      onSelect: () => console.log('Settings'),
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </Button>
      <Command
        open={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="Type a command or search..."
      />
    </>
  );
}

// Example 6: Settings Panel with Tabs
export function SettingsPanelExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4">
              <Input label="Display Name" placeholder="John Doe" />
              <Select
                label="Timezone"
                options={[
                  { value: 'utc', label: 'UTC' },
                  { value: 'est', label: 'Eastern Time' },
                  { value: 'pst', label: 'Pacific Time' },
                ]}
              />
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="space-y-4">
              <Switch label="Email Notifications" />
              <Switch label="Push Notifications" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Example 7: Loading States
export function LoadingStatesExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Button Loading</h3>
        <Button loading>Processing...</Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Progress Bars</h3>
        <Progress value={75} variant="success" showValue />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Skeleton Loading</h3>
        <Card>
          <CardContent className="p-6">
            <Skeleton height={24} width="60%" className="mb-4" />
            <Skeleton height={16} width="100%" className="mb-2" />
            <Skeleton height={16} width="80%" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Full Page Loading</h3>
        <LoadingScreen variant="default" message="Loading your data..." />
      </div>
    </div>
  );
}

// Example 8: Empty States
export function EmptyStatesExample() {
  return (
    <div className="space-y-8">
      <EmptyState
        variant="search"
        title="No results found"
        description="Try adjusting your search or filter to find what you're looking for"
        action={{
          label: 'Clear filters',
          onClick: () => console.log('Clear filters'),
        }}
      />

      <EmptyState
        variant="inbox"
        title="No cases yet"
        description="Get started by creating your first case"
        action={{
          label: 'Create case',
          onClick: () => console.log('Create case'),
        }}
      />
    </div>
  );
}

// Example 9: Form with Validation
export function FormValidationExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  const validate = () => {
    const newErrors = { name: '', email: '' };
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <Select
          label="Role"
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'user', label: 'User' },
            { value: 'guest', label: 'Guest' },
          ]}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
        />
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself"
          autoGrow
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          helperText="Maximum 500 characters"
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="primary" onClick={validate}>
          Save Changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  );
}

// Complete App Example with All Features
export function CompleteAppExample() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <header className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4">
              <Breadcrumbs
                items={[
                  { label: 'Cases', href: '/cases' },
                  { label: 'Case #123' },
                ]}
                showHome
              />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="grid gap-8">
              <LoginFormExample />
              <UserProfileExample />
              <CasesTableExample />
              <SettingsPanelExample />
            </div>
          </main>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
