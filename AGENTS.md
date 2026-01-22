# AGENTS.md - UniLeague Frontend Development Guidelines

This document provides guidelines for agentic coding agents working on the UniLeague frontend project.

## Project Overview

UniLeague is a Next.js 16 football management platform for ASTU (Adama Science and Technology University). It features role-based access control (admin, manager, coach), tournament management, team/player tracking, and match scheduling.

## Build, Lint, and Test Commands

### Core Commands
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint across the project
```

### Single Test Execution
This project currently uses manual testing. To run specific lint checks on files:
```bash
npx eslint [file-path]     # Lint specific file
npx eslint --fix [file]    # Auto-fix linting issues
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with CSS variables
- **UI Components**: Radix UI primitives, class-variance-authority
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod (recommended for validation)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Code Style Guidelines

### TypeScript Conventions

1. **Strict Mode**: Enabled - all TypeScript strict settings are active
2. **Type Exports**: Use explicit type exports (`export type` or `export interface`)
3. **Generic Types**: Use descriptive generic parameter names (`T`, `U`, `K` for keyof)
4. **Null Handling**: Prefer `null` over `undefined` for intentional absence of value
5. **API Response Types**: Define response shapes in `lib/utils.ts`:
   ```typescript
   export interface ApiResponse<T = any, G = any> {
     success?: boolean;
     statusCode: number;
     message: string;
     data?: T;
     meta?: G;
   }
   ```

### Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `TeamCard`, `MatchList` |
| Hooks | camelCase with "use" prefix | `useAuth`, `useFetch` |
| Utilities | camelCase | `cn`, `fetcher`, `formatDate` |
| Constants | SCREAMING_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRY` |
| Types/Interfaces | PascalCase | `ApiResponse`, `User` |
| Files | kebab-case for non-components | `api-client.ts`, `utils.ts` |
| Directories | kebab-case | `components/ui/`, `app/(public)/` |

### Import Order

```typescript
// 1. React imports
import * as React from "react";

// 2. Next.js imports
import Link from "next/link";
import { NextResponse } from "next/server";

// 3. Third-party imports (alphabetical by package name)
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

// 4. @/* imports (path aliases)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// 5. Relative imports
import { formatDate } from "./utils";
```

### Component Patterns

1. **Use `use client` directive** at the top of client components
2. **Use `forwardRef`** when component accepts refs:
   ```typescript
   const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, ...props }, ref) => {
       return <button ref={ref} className={className} {...props} />;
     }
   );
   Button.displayName = "Button";
   ```
3. **Use Radix UI primitives** for accessible interactive components
4. **Use class-variance-authority** for component variants:
   ```typescript
   const buttonVariants = cva("base-classes", {
     variants: {
       variant: { default: "...", destructive: "..." },
       size: { default: "...", sm: "..." },
     },
     defaultVariants: { variant: "default", size: "default" },
   });
   ```

### Tailwind CSS

1. **Use `@` prefix** for custom CSS variables in `globals.css`
2. **Use `cn()` utility** for conditional classes:
   ```typescript
   <div className={cn("base", condition && "conditional", className)} />
   ```
3. **Use linear gradients**: `bg-linear-to-r from-blue-600 to-purple-600`
4. **Use backdrop blur**: `backdrop-blur-sm`, `bg-white/10`
5. **Use CSS grid/flex** for layouts with responsive prefixes (`md:`, `lg:`)

### Error Handling

1. **API Calls**: Use `fetcher` utility with timeout:
   ```typescript
   export async function fetcher(url: string, options?: RequestInit) {
     const controller = new AbortController();
     const timeout = setTimeout(() => controller.abort(), 10000);
     try {
       const res = await fetch(url, { ...options, signal: controller.signal });
       clearTimeout(timeout);
       const data = await res.json();
       if (!res.ok) throw new Error(data?.message || "Something went wrong");
       return data;
     } catch (error: any) {
       if (error.name === "AbortError") throw new Error("Request timed out");
       throw new Error(error.message || "Unexpected error");
     }
   }
   ```
2. **Client-side**: Use `sonner` for toast notifications
3. **Server Components**: Return `NextResponse.json` with proper status codes

### Authentication & Middleware

- Token stored in `aToken` cookie
- Role stored in `role` cookie
- Protected routes defined in `middleware.ts`
- Auth flow: `/auth/` → redirects based on role

### File Structure

```
app/
├── (private)/           # Protected routes (auth check via middleware)
│   ├── admin/           # Super admin only
│   ├── manager/         # Tournament managers only
│   └── coach/           # Coaches only
├── (public)/            # Public routes
├── api/                 # API routes (if any)
├── layout.tsx           # Root layout
└── page.tsx             # Homepage

components/
├── ui/                  # Shadcn-like primitive components
├── pages/               # Page-specific components
└── *.tsx                # Shared components

lib/
├── utils.ts             # Utilities (cn, fetcher, types)
└── *.ts                 # Other utilities

middleware.ts            # Auth middleware
next.config.ts           # Next.js config
tsconfig.json            # TypeScript config (paths: @/* → ./*)
```

### Route Patterns

- Use route groups: `app/(public)/`, `app/(private)/admin/`
- Dynamic routes: `app/(public)/teams/[id]/page.tsx`
- Shared layouts in route group directories

### Recommended Patterns

1. **Data Fetching**: Use SWR for client-side, direct fetch in server components
2. **Forms**: React Hook Form + Zod for validation
3. **Loading States**: Create dedicated loading components in `components/pages/`
4. **Error States**: Create dedicated error components in `components/pages/`
5. **Empty States**: Create dedicated empty state components

### Accessibility

- Use Radix UI primitives for keyboard-navigable components
- Include `aria-label` on icon-only buttons
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)

## Architecture Notes

- **API Communication**: All API calls go through `/api` proxy (handled by backend team)
- **Cookie-based Auth**: No localStorage for tokens
- **Role-based Redirects**: Middleware handles route protection
- **Server Actions**: Use for form submissions where appropriate
