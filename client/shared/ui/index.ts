/**
 * Shared UI Module
 * Re-exports common UI components for use across feature modules
 */

// Layout Components
export { PageHeader } from '@/components/common/PageHeader';
export { PageLayout } from '@/components/common/PageLayout';
export { ContentSection } from '@/components/common/ContentSection';

// Form Components
export { Button } from '@/components/common/Button';
export { SearchInput } from '@/components/common/SearchInput';
export { FilterBar } from '@/components/common/FilterBar';
export { FormSection } from '@/components/common/FormSection';
export { FormFieldGroup } from '@/components/common/FormFieldGroup';
export * from '@/components/common/Inputs';

// Display Components
export { Card } from '@/components/common/Card';
export { Badge } from '@/components/common/Badge';
export { Avatar } from '@/components/common/Avatar';
export { UserAvatar } from '@/components/common/UserAvatar';
export { MetricCard } from '@/components/common/MetricCard';
export { StatusCard } from '@/components/common/StatusCard';
export { StatusIndicator } from '@/components/common/StatusIndicator';
export { ProgressBar } from '@/components/common/ProgressBar';
export { StatCard } from '@/components/common/Stats';

// Navigation Components
export { TabNavigation } from '@/components/common/TabNavigation';
export { Tabs } from '@/components/common/Tabs';
export { PillNavigation } from '@/components/common/PillNavigation';
export { SidebarNavigation } from '@/components/common/SidebarNavigation';

// Table Components
export { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
export { DataListItem } from '@/components/common/DataListItem';

// Modal & Overlay Components
export { Modal } from '@/components/common/Modal';
export { ConfirmationModal } from '@/components/common/ConfirmationModal';
export { Alert } from '@/components/common/Alert';

// Action Components
export { ActionButtonGroup } from '@/components/common/ActionButtonGroup';
export { EditorToolbar } from '@/components/common/EditorToolbar';
export { FileUploadZone } from '@/components/common/FileUploadZone';

// Expandable Components
export { ExpandableSection } from '@/components/common/ExpandableSection';
export { StepHeader } from '@/components/common/StepHeader';

// Loading & Error States
export { LoadingSpinner } from '@/components/common/LoadingSpinner';
export { EmptyState } from '@/components/common/EmptyState';
export { ErrorBoundary } from '@/components/common/ErrorBoundary';
export { SafeComponent } from '@/components/common/SafeComponent';

// Specialized Components
export { AttorneyCard } from '@/components/common/AttorneyCard';
export { EvidenceTypeIcon } from '@/components/common/EvidenceTypeIcon';
