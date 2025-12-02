# Billing Feature - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Add Timer Widget (Required)
```tsx
// In your main App.tsx or Layout.tsx
import { TimerWidget } from '@/features/billing';

export default function App() {
  return (
    <>
      {/* Your app content */}
      <TimerWidget />
    </>
  );
}
```

### 2. Add Routes
```tsx
import {
  BillingDashboardPage,
  TimeEntriesPage,
  InvoicesPage,
} from '@/features/billing';

// In your router configuration
<Route path="/billing" element={<BillingDashboardPage />} />
<Route path="/billing/time" element={<TimeEntriesPage />} />
<Route path="/billing/invoices" element={<InvoicesPage />} />
```

### 3. Add Timer Button to Case Pages (Optional)
```tsx
import { TimerButton } from '@/features/billing';

function CasePage({ caseId, caseName }) {
  return (
    <div>
      <h1>{caseName}</h1>
      <TimerButton caseId={caseId} caseName={caseName} />
    </div>
  );
}
```

## 📚 Common Use Cases

### Track Time with Timer
```tsx
import { useStartTimer, useStopTimer, useRunningTimer } from '@/features/billing';

function MyComponent() {
  const { data: timer } = useRunningTimer();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();

  const handleStart = async () => {
    await startTimer.mutateAsync({
      caseId: 'case-123',
      activityType: 'research',
      description: 'Legal research',
      rate: 250,
      isBillable: true,
    });
  };

  const handleStop = async () => {
    await stopTimer.mutateAsync();
  };

  return timer ? (
    <button onClick={handleStop}>Stop Timer</button>
  ) : (
    <button onClick={handleStart}>Start Timer</button>
  );
}
```

### Create Time Entry Manually
```tsx
import { useCreateTimeEntry } from '@/features/billing';

function AddTimeEntry() {
  const createEntry = useCreateTimeEntry();

  const handleSubmit = async (data) => {
    await createEntry.mutateAsync({
      caseId: data.caseId,
      date: data.date,
      duration: 90, // minutes
      activityType: 'research',
      description: data.description,
      isBillable: true,
      rate: 250,
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### List Time Entries with Filters
```tsx
import { useTimeEntries, useBillingStore } from '@/features/billing';

function TimeEntryList() {
  const filters = useBillingStore((state) => state.timeEntryFilters);
  const setFilters = useBillingStore((state) => state.setTimeEntryFilters);

  const { data: entries, isLoading } = useTimeEntries(filters);

  return (
    <div>
      <input
        type="date"
        value={filters.startDate || ''}
        onChange={(e) => setFilters({ startDate: e.target.value })}
      />
      {entries?.map(entry => (
        <div key={entry.id}>{entry.description}</div>
      ))}
    </div>
  );
}
```

### Create Invoice
```tsx
import { useCreateInvoice } from '@/features/billing';

function CreateInvoiceButton({ caseId, clientId, timeEntryIds }) {
  const createInvoice = useCreateInvoice();

  const handleCreate = async () => {
    await createInvoice.mutateAsync({
      caseId,
      clientId,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      timeEntryIds,
      taxRate: 0.08,
    });
  };

  return <button onClick={handleCreate}>Create Invoice</button>;
}
```

### Record Payment
```tsx
import { useRecordPayment } from '@/features/billing';

function RecordPaymentButton({ invoiceId, amount }) {
  const recordPayment = useRecordPayment();

  const handleRecord = async () => {
    await recordPayment.mutateAsync({
      invoiceId,
      amount,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'check',
      transactionId: '12345',
    });
  };

  return <button onClick={handleRecord}>Record Payment</button>;
}
```

### Display Billing Metrics
```tsx
import { useBillingMetrics } from '@/features/billing';
import { formatCurrency, formatHours } from '@/features/billing';

function BillingMetrics() {
  const { data: metrics } = useBillingMetrics({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
  });

  if (!metrics) return <div>Loading...</div>;

  return (
    <div>
      <div>Hours: {formatHours(metrics.totalBillableHours)}</div>
      <div>Revenue: {formatCurrency(metrics.totalRevenue)}</div>
      <div>Outstanding: {formatCurrency(metrics.outstandingReceivables)}</div>
      <div>Realization: {metrics.averageRealizationRate.toFixed(0)}%</div>
    </div>
  );
}
```

## 🎨 Use Pre-built Components

### Time Entry Form
```tsx
import { TimeEntryForm } from '@/features/billing';

function MyPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button onClick={() => setShowForm(true)}>Add Time</button>
      {showForm && (
        <TimeEntryForm
          caseId="case-123"
          caseName="Smith v. Jones"
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            // Refresh list
          }}
        />
      )}
    </>
  );
}
```

### Quick Time Entry
```tsx
import { QuickTimeEntry } from '@/features/billing';

function MyPage() {
  return (
    <div>
      <h2>Add Time</h2>
      <QuickTimeEntry
        caseId="case-123"
        onSuccess={() => console.log('Entry created!')}
      />
    </div>
  );
}
```

### Invoice Card
```tsx
import { InvoiceCard } from '@/features/billing';

function InvoiceList({ invoices }) {
  return (
    <div>
      {invoices.map(invoice => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onClick={() => navigate(`/invoices/${invoice.id}`)}
        />
      ))}
    </div>
  );
}
```

## 🔧 Utility Functions

```tsx
import {
  formatCurrency,
  formatHours,
  formatDate,
  formatDuration,
  parseDurationToMinutes,
  minutesToHours,
} from '@/features/billing';

// Format currency
formatCurrency(1250.50) // "$1,250.50"
formatCurrency(1250.50, false) // "$1,251"

// Format hours
formatHours(1.5) // "1h 30m"
formatHours(0.25) // "15m"

// Format duration (seconds)
formatDuration(3665) // "01:01:05"

// Parse duration
parseDurationToMinutes("1h 30m") // 90
parseDurationToMinutes("1.5") // 90
parseDurationToMinutes("90") // 90

// Convert
minutesToHours(90) // 1.5
```

## 🎯 Activity Types

Available activity types:
- `research` - Legal Research
- `drafting` - Document Drafting
- `review` - Document Review
- `correspondence` - Correspondence
- `phone_call` - Phone Call
- `meeting` - Meeting
- `court_appearance` - Court Appearance
- `travel` - Travel
- `admin` - Administrative
- `consultation` - Client Consultation
- `negotiation` - Negotiation
- `filing` - Filing
- `discovery` - Discovery
- `deposition` - Deposition
- `trial_prep` - Trial Preparation
- `other` - Other

## 📊 Invoice Statuses

- `draft` - Draft (editable)
- `sent` - Sent to client
- `viewed` - Client viewed invoice
- `partial` - Partially paid
- `paid` - Fully paid
- `overdue` - Past due date
- `void` - Voided
- `written-off` - Written off

## 💳 Payment Methods

- `cash` - Cash
- `check` - Check
- `credit_card` - Credit Card
- `bank_transfer` - Bank Transfer
- `ach` - ACH
- `wire` - Wire Transfer
- `other` - Other

## 🔑 Required Backend Endpoints

Your backend must implement these endpoints:

```
GET    /api/billing/time-entries
POST   /api/billing/time-entries
PUT    /api/billing/time-entries/:id
DELETE /api/billing/time-entries/:id
GET    /api/billing/time-entries/summary
GET    /api/billing/time-entries/unbilled

GET    /api/billing/timer
POST   /api/billing/timer/start
POST   /api/billing/timer/stop

GET    /api/billing/invoices
POST   /api/billing/invoices
GET    /api/billing/invoices/:id
PUT    /api/billing/invoices/:id
DELETE /api/billing/invoices/:id
POST   /api/billing/invoices/:id/send
POST   /api/billing/invoices/:id/void
GET    /api/billing/invoices/:id/pdf
POST   /api/billing/invoices/:id/payments

GET    /api/billing/metrics
```

## 🐛 Troubleshooting

### Timer not showing?
Make sure you added `<TimerWidget />` to your main app layout.

### Timer not persisting?
The timer updates every 5 seconds. Check your backend timer endpoint.

### Time entries not loading?
Check that `/api/billing/time-entries` endpoint is returning data in the correct format.

### Invoices not creating?
Verify that all required fields are provided and the backend endpoint is working.

## 📖 More Information

- See `README.md` for detailed documentation
- See `IMPLEMENTATION_SUMMARY.md` for complete feature overview
- Check TypeScript types in `api/billing.types.ts` for data structures

## 🎉 That's it!

You're ready to use the billing feature. Happy coding!
