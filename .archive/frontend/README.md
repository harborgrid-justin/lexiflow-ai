# LexiFlow AI Frontend

Enterprise legal research platform frontend built with React 19, TypeScript, and modern web technologies.

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript 5.8+** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **TanStack Router v1** - Type-safe routing
- **TanStack Query v5** - Server state management
- **Zustand** - Global client state management
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - API client with interceptors

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Backend API

The frontend expects a backend API running at `http://localhost:3001/api`. Make sure the backend is running before starting the frontend.

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and hooks
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── types.ts      # API type definitions
│   │   └── hooks/        # TanStack Query hooks
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   └── ui/           # UI components (Sidebar, Header, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   │   ├── RootLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── lib/              # Utility functions and constants
│   ├── routes/           # TanStack Router routes
│   │   ├── __root.tsx    # Root route
│   │   ├── _authenticated/ # Protected routes
│   │   └── auth/         # Auth routes
│   ├── stores/           # Zustand stores
│   │   ├── auth.store.ts # Authentication state
│   │   ├── ui.store.ts   # UI state (theme, sidebar, etc.)
│   │   └── app.store.ts  # Global app state
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## Key Features

### Authentication
- JWT-based authentication with automatic token refresh
- Protected routes with redirect to login
- Persistent auth state with Zustand

### Layout
- Responsive sidebar (collapsible: 240px ↔ 64px)
- Top header with search, notifications, and user menu
- Command palette (Cmd+K) for quick navigation
- Breadcrumb navigation

### Routing
- File-based routing with TanStack Router
- Type-safe navigation
- Authentication guards
- Automatic code splitting

### State Management
- **Auth Store**: User authentication, login/logout
- **UI Store**: Theme, sidebar state, notifications, command palette
- **App Store**: Breadcrumbs, page title, global loading

### API Layer
- Axios client with request/response interceptors
- Automatic JWT token attachment
- Token refresh on 401 responses
- TanStack Query hooks for data fetching

### Theme
- Dark mode by default
- Enterprise legal theme (blue/slate)
- Professional, clean design
- Accessible (WCAG 2.1 AA)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.example` for all available environment variables.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Proprietary - LexiFlow AI
