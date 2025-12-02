/**
 * Icon System for LexiFlow AI
 *
 * This module provides a centralized icon system using Lucide React.
 * All icons are re-exported from lucide-react for consistent usage across the app.
 *
 * Usage:
 * import { Icon, User, Search, Settings } from '@/components/icons';
 *
 * <Icon icon={User} size="md" />
 * or
 * <User className="h-4 w-4" />
 */

export { Icon } from './Icon';

// Re-export commonly used icons from lucide-react
export {
  // Navigation & UI
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreHorizontal,
  MoreVertical,

  // Actions
  Plus,
  Minus,
  Edit,
  Edit2,
  Edit3,
  Trash,
  Trash2,
  Save,
  Download,
  Upload,
  Copy,
  Check,
  CheckCircle,
  CheckCircle2,

  // Search & Filter
  Search,
  Filter,
  SlidersHorizontal,

  // User & Account
  User,
  User2,
  UserPlus,
  UserMinus,
  Users,
  UserCircle,
  UserCircle2,

  // Settings & Config
  Settings,
  Settings2,
  Sliders,
  Tool,
  Wrench,

  // Files & Documents
  File,
  FileText,
  FileCheck,
  FilePlus,
  FileMinus,
  Files,
  Folder,
  FolderOpen,
  FolderPlus,
  FileQuestion,

  // Communication
  Mail,
  MailOpen,
  Send,
  MessageSquare,
  MessageCircle,
  Phone,
  PhoneCall,
  Video,

  // Media
  Image,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,

  // Status & Alerts
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  XCircle,
  Loader,
  Loader2,

  // Time & Calendar
  Clock,
  Calendar,
  CalendarDays,
  CalendarPlus,

  // Data & Analytics
  BarChart,
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,

  // Security & Privacy
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Key,

  // Finance & Commerce
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingCart,
  ShoppingBag,

  // Social & Sharing
  Share,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Star,

  // Layout & View
  Maximize,
  Minimize,
  Maximize2,
  Minimize2,
  Grid,
  List,
  Columns,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,

  // Misc
  Bell,
  BellOff,
  Bookmark,
  BookmarkPlus,
  Tag,
  Tags,
  Link,
  Link2,
  ExternalLink,
  Pin,
  MapPin,
  Globe,
  Zap,
  Sparkles,
  Award,
  Trophy,
  Flag,

  // Legal specific icons
  Briefcase,
  Scale,
  FileSignature,
  Gavel,
  Building,
  Building2,
  Stamp,

  // Navigation arrows
  MoveRight,
  MoveLeft,
  MoveUp,
  MoveDown,

  // Refresh & Sync
  RefreshCw,
  RotateCw,
  RotateCcw,

  // Power & System
  Power,
  Wifi,
  WifiOff,
  Database,
  Server,
  Terminal,
  Code,
  Code2,

  // Nature & Objects
  Sun,
  Moon,
  Cloud,
  Inbox,

} from 'lucide-react';

// Type exports
export type { LucideIcon, LucideProps } from 'lucide-react';
