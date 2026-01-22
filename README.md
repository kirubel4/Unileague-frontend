# UniLeague - ASTU Football Management Platform

<p align="center">
  <img src="https://unileague-frontend.vercel.app/" alt="UniLeague Platform" width="100%" />
</p>

<p align="center">
  <strong>A comprehensive football management platform for Adama Science and Technology University (ASTU)</strong>
</p>

<p align="center">
  <a href="https://unileague-frontend.vercel.app/">🌐 Live Demo</a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#tech-stack">Tech Stack</a>
  ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## 🎯 Overview

UniLeague is a modern, full-featured football management platform built with Next.js 16 that serves the Adama Science and Technology University (ASTU) community. The platform provides a complete ecosystem for managing university football tournaments, tracking teams and players, scheduling matches, and keeping the community informed with the latest news and announcements.

Whether you're a super administrator managing the entire system, a tournament manager organizing competitions, a coach preparing your team for matches, or a student browsing tournaments and following your favorite teams, UniLeague delivers a seamless and intuitive experience tailored to your role.

## ✨ Features

### 👥 Role-Based Access Control

UniLeague implements a robust role-based access control system with three distinct user roles:

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Super Admin** | Platform administrators | Full system control, user management, system logs, settings |
| **Tournament Manager** | Competition organizers | Tournament creation, team/player management, match scheduling |
| **Coach** | Team coaches | Lineup management, player statistics, fixture planning |
| **Public** | All visitors | Browse tournaments, view matches, explore teams, read news |

### 🏆 Tournament Management

- Create and configure tournaments with custom rules and formats
- Manage tournament lifecycle from registration to final results
- Track tournament standings and leaderboards
- Handle team registrations and资格审核
- Publish tournament announcements and updates

### 👤 Team & Player Management

- Comprehensive team profiles with roster information
- Player statistics tracking and performance metrics
- Transfer management system for tournament managers
- Player search and filtering capabilities
- Historical performance data and records

### 📅 Match Scheduling & Results

- Automated fixture generation and scheduling
- Real-time match updates and results
- Venue management and time scheduling
- Match history and statistics
- Live score tracking during matches

### 📰 News & Announcements

- Centralized news hub for all platform announcements
- Tournament-specific news and updates
- Image gallery for match highlights and events
- Pagination and filtering for easy content discovery
- Admin-controlled publishing workflow

### 📊 Coach Tools

- Lineup management for match preparation
- Historical lineup review and analysis
- Player statistics and performance tracking
- Fixture planning and preparation
- Team image management

## 🛠 Tech Stack

UniLeague is built with modern, industry-standard technologies to ensure performance, maintainability, and scalability:

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI Primitives |
| **State Management** | SWR |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **CSS Utilities** | class-variance-authority, tailwind-merge |

## 🏗 Architecture

```
unileague-frontend/
├── app/                          # Next.js App Router
│   ├── (private)/               # Protected routes with auth middleware
│   │   ├── admin/              # Super admin dashboard
│   │   ├── coach/              # Coach portal
│   │   ├── manager/            # Tournament manager portal
│   │   └── auth/               # Authentication routes
│   ├── (public)/               # Public routes
│   │   ├── tournaments/        # Tournament browsing
│   │   ├── matches/            # Match schedules and results
│   │   ├── teams/              # Team directory
│   │   ├── news/               # News and announcements
│   │   └── about/              # About page
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── ui/                     # Reusable UI components (Shadcn-like)
│   └── pages/                  # Page-specific components
├── lib/
│   ├── utils.ts               # Utility functions and types
│   └── fetcher.ts             # API fetching utilities
├── middleware.ts              # Authentication middleware
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── eslint.config.mjs          # ESLint configuration
```

### Route Groups

The project uses Next.js route groups to organize routes with shared layouts:

- `(private)/` - Protected routes requiring authentication
- `(public)/` - Publicly accessible routes

### Middleware Protection

Authentication and authorization are handled via `middleware.ts`, which:

- Validates JWT tokens from cookies (`aToken`)
- Checks user roles from cookies (`role`)
- Redirects unauthorized users to appropriate pages
- Protects routes based on user roles

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager
- Backend API endpoint (configure in environment variables)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/unileague-frontend.git
   cd unileague-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=https://your-api-endpoint.com/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the platform.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint across the project |
| `npx eslint [file]` | Lint specific file |
| `npx eslint --fix [file]` | Auto-fix linting issues |

## 📱 Pages Overview

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with platform overview and quick navigation |
| `/tournaments` | Browse all available tournaments |
| `/tournaments/[id]` | Tournament details and registration |
| `/tournaments/register` | Player/team registration page |
| `/matches` | Match schedules and results |
| `/matches/[id]` | Match details and statistics |
| `/teams` | Team directory and profiles |
| `/teams/[id]` | Team details, roster, and statistics |
| `/news` | News and announcements hub |
| `/about` | About the platform |

### Admin Portal (`/admin`)

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Overview and quick actions |
| `/admin/tournaments` | Manage all tournaments |
| `/admin/tournaments/create` | Create new tournament |
| `/admin/managers` | Manage tournament managers |
| `/admin/news` | Manage platform news |
| `/admin/messages` | System messages |
| `/admin/system-logs` | View system activity logs |
| `/admin/settings` | Platform settings |

### Manager Portal (`/manager`)

| Route | Description |
|-------|-------------|
| `/manager/dashboard` | Overview and quick actions |
| `/manager/tournaments` | Manage assigned tournaments |
| `/manager/teams` | Team management |
| `/manager/players` | Player roster and transfers |
| `/manager/matches` | Match scheduling |
| `/manager/fixtures` | Fixture setup and confirmation |
| `/manager/news` | News management |
| `/manager/gallery` | Image gallery |
| `/manager/messages` | Messages |
| `/manager/standings` | Tournament standings |
| `/manager/settings` | Personal settings |

### Coach Portal (`/coach`)

| Route | Description |
|-------|-------------|
| `/coach/dashboard` | Overview and quick actions |
| `/coach/line-up` | Lineup management |
| `/coach/lineupHistory` | Historical lineups |
| `/coach/fixtures` | Upcoming fixtures |
| `/coach/stats` | Team and player statistics |
| `/coach/images` | Team image management |
| `/coach/messages` | Messages |
| `/coach/settings` | Personal settings |

## 🎨 Design System

UniLeague follows a consistent design language built on Tailwind CSS:

### Color Palette

- **Primary**: Blue (#2563eb) with gradient variations
- **Secondary**: Purple (#7c3aed)
- **Accents**: Green, Orange, Gray
- **Background**: Light gray gradients with clean white surfaces

### UI Components

All UI components are built using:

- **Radix UI** for accessible primitives
- **class-variance-authority** for variant management
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations

### Key UI Components

- `Button` - Multiple variants (default, destructive, outline, secondary, ghost, link)
- `Card` - Content containers with various styles
- `Table` - Data display with pagination
- `Form` - Form inputs with validation
- `Select` - Dropdown selections
- `Tabs` - Tab navigation
- `Dialog` - Modal dialogs
- And more...

## 🔐 Authentication

UniLeague uses cookie-based authentication:

- **JWT Token** stored in `aToken` cookie
- **User Role** stored in `role` cookie
- **Secure HttpOnly** cookies for production
- **Middleware** handles route protection

### User Roles

| Role | Cookie Value | Access Level |
|------|--------------|--------------|
| Super Admin | `superAdmin` | Full admin access |
| Tournament Manager | `tournamentManager` | Manager portal |
| Coach | `coach` | Coach portal |
| Public | - | Public pages only |

## 📡 API Integration

All API communication goes through the backend API proxy. The `fetcher` utility in `lib/utils.ts` provides:

- Automatic timeout handling (10 seconds)
- Error handling with meaningful messages
- JSON response parsing
- AbortController support for cancellation

```typescript
import { fetcher } from "@/lib/utils";

const data = await fetcher("/api/tournaments");
```

## 🧪 Development Guidelines

For developers contributing to this project, please refer to [AGENTS.md](./AGENTS.md) for comprehensive guidelines including:

- Code style conventions
- TypeScript best practices
- Component patterns
- Tailwind CSS guidelines
- Error handling strategies
- Accessibility requirements

## 🚀 Deployment

UniLeague is configured for seamless deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel automatically detects Next.js projects

### Build for Production

```bash
npm run build
npm run start
```

### Preview Deployment

```bash
npm run build
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vercel](https://vercel.com/) - Deployment platform

---

<p align="center">
  Built with ❤️ for ASTU
</p>
