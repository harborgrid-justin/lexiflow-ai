# LexiFlow AI Design System

A world-class, enterprise-grade design system built for legal practice management. Exceeds Bloomberg Law, LexisNexis, and Westlaw in visual sophistication while maintaining the usability of modern tools like Linear and Notion.

## Features

- **Premium Visual Design**: Deep blue enterprise theme with sophisticated color palette
- **Dark Mode First**: Optimized for professional legal work with excellent dark mode support
- **Fully Accessible**: ARIA compliant with complete keyboard navigation
- **Smooth Animations**: Micro-interactions powered by Framer Motion
- **Type Safe**: Built with TypeScript for excellent developer experience
- **Design Tokens**: Consistent design language using CSS custom properties
- **Responsive**: Mobile-first approach with responsive breakpoints

## Design Tokens

### Color System

#### Primary - Deep Blue Scale
```css
--primary-950: #0f172a  /* Deep navy - primary dark background */
--primary-900: #0c4a6e
--primary-800: #075985
--primary-700: #0369a1
--primary-600: #0284c7
--primary-500: #0ea5e9
--primary-400: #38bdf8  /* Electric blue - main accent */
--primary-300: #7dd3fc
--primary-200: #bae6fd
--primary-100: #e0f2fe
--primary-50: #f0f9ff
```

#### Semantic Colors
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Rose (#f43f5e)
- **Neutral**: Slate grays

### Typography

**Font Family**: Inter (sans-serif), JetBrains Mono (monospace)

**Scale**: 4px base
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

### Spacing

4px base system: 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32

### Shadow Elevation

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

## Components

### Form Components

#### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

**Variants**: primary, secondary, ghost, danger, outline, link
**Sizes**: sm, md, lg, icon
**Features**: Loading state, left/right icons, keyboard navigation

#### Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
  leftIcon={<Mail />}
/>
```

**Features**: Label, error states, helper text, icons, keyboard navigation

#### Select
```tsx
import { Select } from '@/components/ui';

<Select
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  searchable
  placeholder="Select option"
/>
```

**Features**: Searchable, multi-select support, custom styling

#### Checkbox & Radio
```tsx
import { Checkbox, Radio } from '@/components/ui';

<Checkbox
  label="Accept terms"
  description="You must accept the terms"
  indeterminate={false}
/>

<Radio
  label="Option 1"
  description="Select this option"
/>
```

#### Switch
```tsx
import { Switch } from '@/components/ui';

<Switch
  label="Enable notifications"
  description="Receive email notifications"
  onCheckedChange={(checked) => console.log(checked)}
/>
```

#### Textarea
```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  autoGrow
  placeholder="Enter description"
/>
```

### Display Components

#### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md" dot>
  Active
</Badge>
```

**Variants**: default, primary, secondary, success, warning, danger, outline
**Sizes**: sm, md, lg

#### Avatar
```tsx
import { Avatar } from '@/components/ui';

<Avatar
  src="/avatar.jpg"
  name="John Doe"
  size="md"
  status="online"
/>
```

**Sizes**: xs, sm, md, lg, xl, 2xl
**Status**: online, offline, away, busy

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

**Variants**: default, elevated, outlined, glass

#### Progress
```tsx
import { Progress, CircularProgress } from '@/components/ui';

<Progress value={75} max={100} variant="success" showValue />

<CircularProgress value={75} size={120} showValue />
```

#### Skeleton
```tsx
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/ui';

<Skeleton variant="default" animation="wave" height={100} />
<SkeletonCard />
<SkeletonTable rows={5} columns={4} />
```

### Overlay Components

#### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent size="md" showClose>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

#### Sheet
```tsx
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui';

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger>Open Sheet</SheetTrigger>
  <SheetContent side="right" size="md">
    Sheet content
  </SheetContent>
</Sheet>
```

**Sides**: top, right, bottom, left

#### Tooltip
```tsx
import { Tooltip } from '@/components/ui';

<Tooltip content="Helpful tip" side="top">
  <button>Hover me</button>
</Tooltip>
```

#### Dropdown
```tsx
import { Dropdown } from '@/components/ui';

<Dropdown
  items={[
    { label: 'Edit', value: 'edit', icon: <Edit /> },
    { label: 'Delete', value: 'delete', destructive: true },
  ]}
  onSelect={(value) => console.log(value)}
>
  <Button>Actions</Button>
</Dropdown>
```

#### Command Palette
```tsx
import { Command } from '@/components/ui';

<Command
  open={open}
  onOpenChange={setOpen}
  items={commandItems}
  placeholder="Search commands..."
/>
```

**Features**: Keyboard navigation (Cmd+K), search, groups

### Navigation Components

#### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Accordion
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item1">
    <AccordionTrigger>Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Data Display Components

#### Table
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';

<Table hoverable striped>
  <TableHeader>
    <TableRow>
      <TableHead sortable>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Calendar
```tsx
import { Calendar } from '@/components/ui';

<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date()}
/>
```

### Composite Components

#### SearchInput
```tsx
import { SearchInput } from '@/components';

<SearchInput
  value={search}
  onChange={setSearch}
  suggestions={suggestions}
  onSuggestionSelect={handleSelect}
  loading={isLoading}
/>
```

#### DataTable
```tsx
import { DataTable } from '@/components';

<DataTable
  data={data}
  columns={columns}
  selectable
  pagination
  pageSize={10}
  onExport={handleExport}
/>
```

**Features**: Sorting, pagination, selection, column visibility, export

#### EmptyState
```tsx
import { EmptyState } from '@/components';

<EmptyState
  variant="search"
  title="No results found"
  description="Try adjusting your search"
  action={{ label: 'Clear filters', onClick: clearFilters }}
/>
```

#### ErrorBoundary
```tsx
import { ErrorBoundary } from '@/components';

<ErrorBoundary onError={handleError}>
  <App />
</ErrorBoundary>
```

#### LoadingScreen
```tsx
import { LoadingScreen } from '@/components';

<LoadingScreen variant="full" message="Loading application..." />
```

#### Breadcrumbs
```tsx
import { Breadcrumbs } from '@/components';

<Breadcrumbs
  items={[
    { label: 'Cases', href: '/cases' },
    { label: 'Case #123', href: '/cases/123' },
    { label: 'Documents' },
  ]}
  showHome
/>
```

### Toast Notifications

```tsx
import { ToastProvider, useToast } from '@/components/ui';

// Wrap your app
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { addToast } = useToast();

addToast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'success',
  duration: 5000,
});
```

## Icons

```tsx
import { Icon, User, Search, Settings } from '@/components/icons';

// Use Icon wrapper
<Icon icon={User} size="md" />

// Or use directly
<User className="h-4 w-4" />
```

## Best Practices

1. **Consistent Spacing**: Use the 4px spacing scale
2. **Color Usage**: Use semantic colors (success, warning, error) for appropriate contexts
3. **Typography**: Maintain hierarchy with font sizes
4. **Accessibility**: Always include labels, ARIA attributes, and keyboard navigation
5. **Dark Mode**: Test components in both light and dark modes
6. **Performance**: Use lazy loading for heavy components
7. **Animations**: Keep animations subtle and purposeful (150-300ms)

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:

- Keyboard navigation (Tab, Enter, Space, Arrow keys, Escape)
- Screen reader support with proper ARIA labels
- Focus indicators
- Color contrast ratios
- Semantic HTML

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## License

Proprietary - LexiFlow AI © 2025
