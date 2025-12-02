/**
 * LexiFlow AI Design System
 * Enterprise-grade UI components for legal practice management
 *
 * All components support:
 * - Dark mode (default) and light mode
 * - Smooth micro-interactions with Framer Motion
 * - Full keyboard navigation and ARIA compliance
 * - TypeScript with proper type definitions
 * - Tailwind CSS with design tokens
 */

// Form Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio } from './Radio';
export type { RadioProps } from './Radio';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

// Display Components
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card';
export type { CardProps } from './Card';

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Progress, CircularProgress } from './Progress';
export type { ProgressProps, CircularProgressProps } from './Progress';

// Feedback Components
export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export { ToastProvider, useToast, toast } from './Toast';
export type { Toast } from './Toast';

// Overlay Components
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';
export type { DialogProps, DialogContentProps } from './Dialog';

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './Sheet';
export type { SheetProps, SheetContentProps } from './Sheet';

export { Popover } from './Popover';
export type { PopoverProps } from './Popover';

export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownMenuItem } from './Dropdown';

export { Command } from './Command';
export type { CommandProps, CommandItem } from './Command';

// Navigation Components
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export type { TabsProps } from './Tabs';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
export type { AccordionProps } from './Accordion';

// Data Display Components
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './Table';
export type { TableProps, TableHeadProps } from './Table';

export { Calendar } from './Calendar';
export type { CalendarProps } from './Calendar';
