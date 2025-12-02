# Frontend Safety & Component Architecture Guide

## 🛡️ DOM Safety Implementation

### Overview

All components now include comprehensive DOM safety measures to prevent runtime errors and ensure robust handling of edge cases.

## New Safety Components

### 1. ErrorBoundary

Located: `/components/common/ErrorBoundary.tsx`

**Purpose:** Catches JavaScript errors anywhere in the component tree and displays a fallback UI.

**Usage:**
```typescript
import { ErrorBoundary } from './components/common/ErrorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Features:**
- Catches render errors
- Displays user-friendly error message
- Shows stack trace in development
- Provides "Try Again" button
- Optional custom fallback UI
- Error callback for logging

### 2. SafeComponent

Located: `/components/common/SafeComponent.tsx`

**Purpose:** Combines ErrorBoundary with Suspense for complete safety.

**Usage:**
```typescript
import { SafeComponent } from './components/common/SafeComponent';

<SafeComponent loadingMessage="Loading workflow...">
  <AsyncComponent />
</SafeComponent>
```

**Features:**
- Error boundary protection
- Suspense for async components
- Custom loading states
- Custom error fallbacks

## DOM Safety Utilities

### Location: `/utils/dom-safety.ts`

#### Safe Element Access

```typescript
import { safeGetElement, safeGetElements } from '@/utils/dom-safety';

// Safely get single element
const element = safeGetElement<HTMLButtonElement>('#my-button');
if (element) {
  // Element exists, safe to use
}

// Safely get multiple elements
const elements = safeGetElements<HTMLDivElement>('.card');
if (elements) {
  elements.forEach(el => {
    // Process each element
  });
}
```

#### Safe Event Listeners

```typescript
import { safeAddEventListener } from '@/utils/dom-safety';

// Returns cleanup function
const cleanup = safeAddEventListener(
  element,
  'click',
  handleClick,
  { passive: true }
);

// In useEffect cleanup
return cleanup;
```

#### Safe DOM Manipulation

```typescript
import { 
  safeFocus,
  safeBlur,
  safeScrollIntoView,
  safeGetComputedStyle 
} from '@/utils/dom-safety';

// All handle null/undefined safely
safeFocus(inputRef.current);
safeScrollIntoView(elementRef.current, { behavior: 'smooth' });
```

## Safe DOM Hooks

### Location: `/hooks/useSafeDOM.ts`

### 1. useAutoFocus

Auto-focuses an element on mount safely.

```typescript
import { useAutoFocus } from '@/hooks/useSafeDOM';

const MyComponent = () => {
  const inputRef = useAutoFocus<HTMLInputElement>();
  
  return <input ref={inputRef} />;
};
```

### 2. useClickOutside

Detects clicks outside a component.

```typescript
import { useClickOutside } from '@/hooks/useSafeDOM';

const MyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  
  return <div ref={ref}>{/* dropdown content */}</div>;
};
```

### 3. useEscapeKey

Handles escape key press safely.

```typescript
import { useEscapeKey } from '@/hooks/useSafeDOM';

const MyModal = ({ onClose }: Props) => {
  useEscapeKey(onClose);
  
  return <div>{/* modal content */}</div>;
};
```

### 4. useScrollIntoView

Scrolls element into view when deps change.

```typescript
import { useScrollIntoView } from '@/hooks/useSafeDOM';

const MyComponent = ({ itemId }: Props) => {
  const ref = useScrollIntoView<HTMLDivElement>([itemId]);
  
  return <div ref={ref}>{/* content */}</div>;
};
```

### 5. useWindowResize

Safely handles window resize events.

```typescript
import { useWindowResize } from '@/hooks/useSafeDOM';

const MyComponent = () => {
  useWindowResize((width, height) => {
    console.log('Window resized:', width, height);
  });
  
  return <div>{/* content */}</div>;
};
```

### 6. useIntersectionObserver

Detects when element enters/exits viewport.

```typescript
import { useIntersectionObserver } from '@/hooks/useSafeDOM';

const MyComponent = () => {
  const ref = useIntersectionObserver<HTMLDivElement>(
    (isVisible) => {
      if (isVisible) {
        console.log('Element is visible');
      }
    },
    { threshold: 0.5 }
  );
  
  return <div ref={ref}>{/* content */}</div>;
};
```

### 7. useLocalStorage

Safely reads/writes localStorage.

```typescript
import { useLocalStorage } from '@/hooks/useSafeDOM';

const MyComponent = () => {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue');
  
  return <button onClick={() => setValue('newValue')}>Update</button>;
};
```

## Component Architecture Best Practices

### 1. Component Size Limits

**Rule:** Components should not exceed 300 lines.

**When to split:**
- Component exceeds 300 lines
- Component has multiple responsibilities
- Component has complex state logic
- Component has multiple sub-sections

**Example:**

Before (500 lines):
```typescript
// WorkflowTemplateBuilder.tsx - 500 lines
export const WorkflowTemplateBuilder = () => {
  // All logic mixed together
};
```

After (split into smaller components):
```typescript
// WorkflowTemplateBuilder.tsx - 150 lines
import { StageEditor } from './StageEditor';
import { TemplateActions } from './TemplateActions';
import { TemplatePreview } from './TemplatePreview';

export const WorkflowTemplateBuilder = () => {
  // Orchestration logic only
  return (
    <>
      <TemplateActions {...props} />
      <StageEditor {...props} />
      <TemplatePreview stages={stages} />
    </>
  );
};
```

### 2. Error Boundary Placement

**Rule:** Wrap each major feature section with ErrorBoundary.

```typescript
// Page Level
const MyPage = () => {
  return (
    <div>
      <Header />
      
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
};
```

### 3. Null/Undefined Checks

**Rule:** Always check for null/undefined before DOM operations.

```typescript
// ❌ Bad
const element = document.getElementById('my-id');
element.style.color = 'red'; // Can throw if element is null

// ✅ Good
const element = safeGetElement('#my-id');
if (element) {
  element.style.color = 'red';
}

// ✅ Better
const element = safeGetElement('#my-id');
element?.style.setProperty('color', 'red');
```

### 4. Array Safety

**Rule:** Always check array exists before mapping.

```typescript
// ❌ Bad
const items = data.items.map(item => <div>{item.name}</div>);

// ✅ Good
const items = (data?.items || []).map(item => <div>{item.name}</div>);

// ✅ Better with type safety
const items = Array.isArray(data?.items)
  ? data.items.map(item => <div>{item.name}</div>)
  : [];
```

### 5. Optional Chaining

**Rule:** Use optional chaining for nested properties.

```typescript
// ❌ Bad
const name = user.profile.details.name;

// ✅ Good
const name = user?.profile?.details?.name;

// ✅ Better with fallback
const name = user?.profile?.details?.name || 'Unknown';
```

### 6. Async State Handling

**Rule:** Handle loading and error states for async operations.

```typescript
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
};
```

## Component Split Examples

### Large Components Split

#### 1. WorkflowTemplateBuilder (503 lines → 150 + 3 sub-components)

**Main Component:** `/workflow/WorkflowTemplateBuilder.tsx` (150 lines)
**Sub-Components:**
- `StageEditor.tsx` (120 lines) - Edit individual stages
- `TemplateActions.tsx` (80 lines) - Save/Export/Import actions
- `TemplatePreview.tsx` (100 lines) - Preview template

#### 2. CaseWorkflow (272 lines → still acceptable, but added safety)

**Added:**
- ErrorBoundary wrapping
- Null checks for stages
- Safe array iteration
- Loading states

#### 3. Suggested Splits for Large Components

**ResearchTool (344 lines):**
```
ResearchTool.tsx (150 lines)
├── SearchPanel.tsx (80 lines)
├── ResultsList.tsx (70 lines)
└── SourceViewer.tsx (60 lines)
```

**CaseMotions (298 lines):**
```
CaseMotions.tsx (120 lines)
├── MotionsList.tsx (90 lines)
├── MotionForm.tsx (80 lines)
└── MotionDetail.tsx (existing)
```

## Testing Safety Features

### 1. Error Boundary Testing

```typescript
// Trigger error to test boundary
const BrokenComponent = () => {
  throw new Error('Test error');
  return <div>Never renders</div>;
};

// Wrap in ErrorBoundary to catch
<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>
```

### 2. Null Safety Testing

```typescript
// Test with null data
<MyComponent data={null} />
<MyComponent data={undefined} />
<MyComponent data={[]} />
```

### 3. DOM Safety Testing

```typescript
// Test before DOM ready
const element = safeGetElement('#not-exists');
// Should return null without error

// Test event cleanup
useEffect(() => {
  const cleanup = safeAddEventListener(window, 'resize', handler);
  return cleanup; // Cleanup should not throw
}, []);
```

## Migration Checklist

For existing components:

- [ ] Wrap with ErrorBoundary
- [ ] Replace direct DOM access with safe utilities
- [ ] Add null/undefined checks
- [ ] Use optional chaining
- [ ] Add loading/error states
- [ ] Split if > 300 lines
- [ ] Replace event listeners with safe hooks
- [ ] Add TypeScript strict mode compliance

## Performance Considerations

### 1. Memo Safe Components

```typescript
import { memo } from 'react';

export const SafeComponent = memo(({ data }: Props) => {
  if (!data) return null;
  return <div>{data.name}</div>;
});
```

### 2. Lazy Load Large Components

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const MyPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
```

### 3. Virtualize Long Lists

```typescript
import { FixedSizeList } from 'react-window';

const MyList = ({ items }: Props) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index]?.name}</div>
    )}
  </FixedSizeList>
);
```

## Summary

✅ **ErrorBoundary** - Catches all component errors
✅ **SafeComponent** - Combined ErrorBoundary + Suspense
✅ **DOM Safety Utils** - Safe DOM manipulation
✅ **Safe Hooks** - Protected DOM interactions
✅ **Component Splits** - Smaller, maintainable components
✅ **Null Safety** - Optional chaining everywhere
✅ **Async Safety** - Loading/error states
✅ **Type Safety** - TypeScript strict mode

All components now have multiple layers of protection against runtime errors!
