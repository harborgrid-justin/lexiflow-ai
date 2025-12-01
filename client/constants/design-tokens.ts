/**
 * Design Tokens for LexiFlow AI
 * Centralized design system constants for colors, spacing, typography, and component variants
 */

export const SPACING = {
  // Page-level spacing
  page: 'space-y-6',
  pageGap: 'gap-6',
  
  // Section-level spacing
  section: 'space-y-4',
  sectionGap: 'gap-4',
  
  // Card/Component spacing
  card: 'gap-4',
  cardPadding: 'p-4',
  cardPaddingLg: 'p-6',
  
  // Small element spacing
  button: 'gap-2',
  metadata: 'gap-3',
  
  // Grid gaps
  gridSm: 'gap-4',
  gridMd: 'gap-6',
  gridLg: 'gap-8',
} as const;

export const COLORS = {
  // Primary brand colors
  primary: {
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    textHover: 'hover:text-blue-700',
    border: 'border-blue-600',
    ring: 'ring-blue-500',
  },
  
  // Neutral colors
  neutral: {
    50: 'bg-slate-50',
    100: 'bg-slate-100',
    200: 'bg-slate-200',
    300: 'bg-slate-300',
    text: 'text-slate-600',
    textLight: 'text-slate-500',
    textDark: 'text-slate-800',
    border: 'border-slate-200',
    borderDark: 'border-slate-300',
  },
  
  // Status colors
  status: {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    inactive: {
      bg: 'bg-slate-100',
      text: 'text-slate-500',
      border: 'border-slate-200',
    },
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
    },
  },
  
  // Chart colors for analytics
  chart: {
    primary: ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
    secondary: ['#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
  },
} as const;

export const TYPOGRAPHY = {
  // Headings
  h1: 'text-3xl font-bold text-slate-900',
  h2: 'text-2xl font-bold text-slate-900',
  h3: 'text-xl font-bold text-slate-800',
  h4: 'text-lg font-semibold text-slate-800',
  
  // Body text
  body: 'text-sm text-slate-600',
  bodyLarge: 'text-base text-slate-600',
  bodySmall: 'text-xs text-slate-500',
  
  // Special text
  mono: 'font-mono text-xs',
  label: 'text-sm font-medium text-slate-700',
} as const;

export const ANIMATIONS = {
  // Page transitions
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  
  // Component transitions
  transition: 'transition-colors duration-200',
  transitionAll: 'transition-all duration-200',
} as const;

export const BORDERS = {
  default: 'border border-slate-200 rounded-lg',
  card: 'border border-slate-200 rounded-lg shadow-sm',
  input: 'border border-slate-300 rounded-md',
  divider: 'border-b border-slate-200',
} as const;

export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  card: 'shadow-sm hover:shadow-md',
} as const;

// Badge variant configurations
export const BADGE_VARIANTS = {
  // Status badges
  active: `${COLORS.status.active.bg} ${COLORS.status.active.text}`,
  inactive: `${COLORS.status.inactive.bg} ${COLORS.status.inactive.text}`,
  warning: `${COLORS.status.warning.bg} ${COLORS.status.warning.text}`,
  error: `${COLORS.status.error.bg} ${COLORS.status.error.text}`,
  success: `${COLORS.status.success.bg} ${COLORS.status.success.text}`,
  info: `${COLORS.status.info.bg} ${COLORS.status.info.text}`,
  
  // Case status badges
  open: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-500',
  
  // Priority badges
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
  
  // Calendar event types
  'event-case': 'bg-purple-50 border-purple-100 text-purple-700',
  'event-compliance': 'bg-amber-50 border-amber-100 text-amber-700',
  'event-task-high': 'bg-red-50 border-red-100 text-red-700',
  'event-task-normal': 'bg-blue-50 border-blue-100 text-blue-700',
  
  // User types
  'user-internal': 'bg-purple-50 text-purple-700 border-purple-100',
  'user-external': 'bg-amber-50 text-amber-700 border-amber-100',
  
  // Permission badges
  permission: 'bg-slate-200 text-slate-600',
  
  // Stage status badges
  'stage-completed': 'bg-green-100 border-green-500 text-green-700',
  'stage-active': 'bg-blue-100 border-blue-500 text-blue-700',
  'stage-pending': 'bg-slate-50 border-slate-300 text-slate-400',
} as const;

// Layout container classes
export const CONTAINERS = {
  // Full-page layouts
  page: `${SPACING.page} ${ANIMATIONS.fadeIn}`,
  pageFlexFull: `h-full flex flex-col ${SPACING.pageGap} ${ANIMATIONS.fadeIn}`,
  
  // Card layouts
  card: `bg-white ${BORDERS.card} ${SPACING.cardPadding}`,
  cardLarge: `bg-white ${BORDERS.card} ${SPACING.cardPaddingLg}`,
  
  // Grid layouts
  grid2: `grid grid-cols-1 md:grid-cols-2 ${SPACING.gridSm}`,
  grid3: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${SPACING.gridMd}`,
  grid4: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${SPACING.gridSm}`,
} as const;

// Button variants
export const BUTTON_VARIANTS = {
  primary: `${COLORS.primary.bg} ${COLORS.primary.bgHover} text-white px-4 py-2 rounded-md font-medium ${ANIMATIONS.transition}`,
  secondary: `${COLORS.neutral[100]} hover:bg-slate-200 ${COLORS.neutral.text} px-4 py-2 rounded-md font-medium ${ANIMATIONS.transition}`,
  outline: `border ${COLORS.neutral.border} ${COLORS.neutral.text} hover:bg-slate-50 px-4 py-2 rounded-md font-medium ${ANIMATIONS.transition}`,
  ghost: `${COLORS.neutral.text} hover:bg-slate-100 px-4 py-2 rounded-md font-medium ${ANIMATIONS.transition}`,
  indigo: `bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-md text-xs font-bold ${ANIMATIONS.transition}`,
} as const;

// Input field styles
export const INPUT_STYLES = {
  base: `w-full px-4 py-2 ${BORDERS.input} text-sm focus:ring-2 ${COLORS.primary.ring} outline-none ${ANIMATIONS.transition}`,
  withIcon: `w-full pl-10 pr-4 py-2 ${BORDERS.input} text-sm focus:ring-2 ${COLORS.primary.ring} outline-none ${ANIMATIONS.transition}`,
} as const;
