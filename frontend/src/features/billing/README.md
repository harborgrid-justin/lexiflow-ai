# Billing & Time Tracking Feature

A comprehensive billing and time tracking system for LexiFlow AI that rivals dedicated legal billing software like Clio and TimeSolv.

## Overview

This feature provides complete billing capabilities including:
- Real-time timer tracking with persistent floating widget
- Time entry management with bulk operations
- Invoice generation and management
- Payment tracking
- Billing metrics and analytics
- LEDES/CSV export support

## Architecture

```
billing/
├── api/
│   ├── billing.types.ts       # TypeScript types and interfaces
│   ├── timeEntries.api.ts     # Time entries API hooks
│   └── invoices.api.ts        # Invoices API hooks
├── components/
│   ├── TimerWidget.tsx        # Floating timer widget
│   ├── TimeEntryRow.tsx       # Time entry list item
│   ├── TimeEntryForm.tsx      # Full time entry form
│   ├── QuickTimeEntry.tsx     # Inline quick entry
│   ├── InvoiceCard.tsx        # Invoice summary card
│   ├── PaymentForm.tsx        # Payment recording form
│   ├── ActivityTypeSelect.tsx # Activity type dropdown
│   ├── BillingChart.tsx       # Chart components
│   ├── HoursSummary.tsx       # Hours summary widget
│   └── RateSelector.tsx       # Rate selection component
├── pages/
│   ├── TimeEntriesPage.tsx    # Time entries management
│   ├── InvoicesPage.tsx       # Invoice list and management
│   └── BillingDashboardPage.tsx # Billing metrics dashboard
├── store/
│   └── billing.store.ts       # Zustand store for global state
├── utils/
│   └── formatters.ts          # Utility formatters
└── index.ts                   # Main exports
```

## Key Features

### 1. Time Tracking
- **Running Timer**: Persistent floating widget that tracks time across the app
- **Quick Time Entry**: Fast inline entry for rapid time logging
- **Timer Button**: One-click timer start from any case page
- **Keyboard Shortcuts**: Fast navigation and actions (planned)

### 2. Time Entry Management
- **Bulk Operations**: Select and edit/delete multiple entries
- **Flexible Grouping**: Group by date, case, or activity type
- **Inline Editing**: Edit entries directly in the list
- **Smart Filters**: Filter by date, case, activity, billable status
- **Export**: Export to CSV, LEDES, Excel formats

### 3. Invoicing
- **Invoice Builder**: Step-by-step wizard for creating invoices
- **Customization**: Header, footer, grouping, detail level
- **PDF Generation**: Professional PDF invoices
- **Email Delivery**: Send invoices directly to clients
- **Payment Tracking**: Record payments and track balances

### 4. Billing Analytics
- **Key Metrics**: Billable hours, revenue, receivables, realization rate
- **Charts**: Revenue trends, practice area breakdown, aging receivables
- **Top Matters**: Highest revenue cases
- **Productivity**: Billable vs non-billable time analysis

## Usage

### Installing the Timer Widget

Add the Timer Widget to your main app layout so it persists across all pages:

```tsx
import { TimerWidget } from '@/features/billing';

function App() {
  return (
    <div>
      {/* Your app content */}
      <TimerWidget />
    </div>
  );
}
```

### Using Time Entry Hooks

```tsx
import { useTimeEntries, useCreateTimeEntry } from '@/features/billing';

function MyComponent() {
  const { data: entries, isLoading } = useTimeEntries({
    caseId: 'case-123',
    startDate: '2025-01-01',
  });

  const createEntry = useCreateTimeEntry();

  const handleCreate = async () => {
    await createEntry.mutateAsync({
      caseId: 'case-123',
      date: new Date().toISOString(),
      duration: 60, // minutes
      activityType: 'research',
      description: 'Legal research on precedent cases',
      isBillable: true,
      rate: 250,
    });
  };

  return (/* ... */);
}
```

### Using Invoice Hooks

```tsx
import { useInvoices, useCreateInvoice } from '@/features/billing';

function InvoiceList() {
  const { data: invoices } = useInvoices({
    status: 'sent',
  });

  const createInvoice = useCreateInvoice();

  const handleCreate = async () => {
    await createInvoice.mutateAsync({
      caseId: 'case-123',
      clientId: 'client-456',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      timeEntryIds: ['entry-1', 'entry-2'],
      taxRate: 0.08,
    });
  };

  return (/* ... */);
}
```

### Using the Billing Store

```tsx
import { useBillingStore } from '@/features/billing';

function FilterComponent() {
  const filters = useBillingStore((state) => state.timeEntryFilters);
  const setFilters = useBillingStore((state) => state.setTimeEntryFilters);

  return (
    <input
      type="date"
      value={filters.startDate || ''}
      onChange={(e) => setFilters({ startDate: e.target.value })}
    />
  );
}
```

## API Endpoints

The feature expects these backend endpoints:

### Time Entries
- `GET /api/billing/time-entries` - List time entries
- `POST /api/billing/time-entries` - Create time entry
- `PUT /api/billing/time-entries/:id` - Update time entry
- `DELETE /api/billing/time-entries/:id` - Delete time entry
- `GET /api/billing/time-entries/summary` - Get summary statistics
- `GET /api/billing/time-entries/unbilled` - Get unbilled entries

### Timer
- `GET /api/billing/timer` - Get running timer
- `POST /api/billing/timer/start` - Start timer
- `POST /api/billing/timer/stop` - Stop timer
- `POST /api/billing/timer/pause` - Pause timer
- `POST /api/billing/timer/resume` - Resume timer

### Invoices
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/invoices/:id` - Get invoice
- `POST /api/billing/invoices` - Create invoice
- `PUT /api/billing/invoices/:id` - Update invoice
- `DELETE /api/billing/invoices/:id` - Delete invoice
- `POST /api/billing/invoices/:id/send` - Send invoice
- `POST /api/billing/invoices/:id/void` - Void invoice
- `POST /api/billing/invoices/:id/remind` - Send reminder
- `GET /api/billing/invoices/:id/pdf` - Download PDF

### Payments
- `GET /api/billing/invoices/:id/payments` - List payments
- `POST /api/billing/invoices/:id/payments` - Record payment

### Metrics
- `GET /api/billing/metrics` - Get billing metrics

## Type Definitions

Key types are defined in `billing.types.ts`:

- `TimeEntry` - Time entry record
- `Invoice` - Invoice record
- `Payment` - Payment record
- `BillingMetrics` - Dashboard metrics
- `ActivityType` - Activity type enum
- `InvoiceStatus` - Invoice status enum
- `PaymentMethod` - Payment method enum

## Best Practices

1. **Timer Widget**: Always include in main layout for persistence
2. **Optimistic Updates**: Use React Query's optimistic updates for better UX
3. **Error Handling**: Always handle API errors gracefully
4. **Loading States**: Show loading indicators for all async operations
5. **Validation**: Validate form data before submission
6. **Keyboard Shortcuts**: Implement for power users
7. **Accessibility**: Ensure all components are accessible

## Keyboard Shortcuts (Planned)

- `Alt + T` - Start/stop timer
- `Alt + N` - New time entry
- `Alt + I` - New invoice
- `Alt + F` - Focus filters
- `Esc` - Close modals/forms

## Future Enhancements

- [ ] Invoice templates with customization
- [ ] Recurring invoices
- [ ] Automatic payment reminders
- [ ] Integration with payment processors (Stripe, Square)
- [ ] Trust accounting features
- [ ] Advanced reporting (profitability analysis)
- [ ] Mobile app with timer tracking
- [ ] Voice-to-text time entry descriptions
- [ ] AI-powered description suggestions
- [ ] Budgeting and forecasting
- [ ] Multi-currency support
- [ ] Tax calculation per jurisdiction
- [ ] Client portal for invoice viewing/payment

## Performance Considerations

- Time entries are cached with React Query (30s stale time)
- Running timer updates every 5 seconds
- Infinite scroll for large time entry lists (planned)
- Virtual scrolling for invoice lists (planned)
- Debounced search filters

## Testing

```bash
# Run tests
npm test billing

# Run specific test file
npm test TimeEntryForm.test.tsx

# Run with coverage
npm test -- --coverage
```

## License

Proprietary - LexiFlow AI

---

**Built with:** React 19, TypeScript, React Query, Zustand, Tailwind CSS, Framer Motion
