# Project Structure Documentation

## Overview
This document provides a detailed explanation of the folder structure and organization of the Asset Management System.

## Root Directory Structure

```
asset-management-next/
├── src/                    # Source code directory
├── public/                 # Static assets
├── .env.local             # Environment variables (gitignored)
├── .env.local.example     # Environment template
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Source Directory (`src/`)

### 1. `/src/actions/` - Server Actions
Server Actions are asynchronous functions that run on the server. They provide a way to mutate data without creating API routes.

```
actions/
├── assets.ts          # Asset CRUD operations
├── users.ts           # User management
├── organizations.ts   # Organization management
└── requests.ts        # Asset request handling
```

**When to use:**
- Direct database operations from React components
- Form submissions
- Data mutations that need server-side logic

**Example:**
```typescript
'use server';
export async function createAsset(data) {
  await dbConnect();
  const asset = await Asset.create(data);
  revalidatePath('/admin/assets');
  return asset;
}
```

### 2. `/src/app/` - Next.js App Router

#### `/src/app/api/` - API Routes (REST API)
RESTful API endpoints for external integrations and client-side data fetching.

```
api/
├── assets/
│   ├── route.ts           # GET /api/assets, POST /api/assets
│   └── [id]/
│       └── route.ts       # GET, PUT, DELETE /api/assets/:id
├── organizations/
│   ├── route.ts
│   └── [id]/route.ts
├── users/
│   ├── route.ts
│   └── [id]/route.ts
└── requests/
    ├── route.ts
    └── [id]/route.ts
```

**When to use:**
- External API integrations
- Mobile app backends
- Third-party service integration
- Complex queries with pagination

#### `/src/app/components/` - React Components

##### UI Components (`/ui/`)
Reusable, design system components (shadcn/ui based):
- buttons.tsx
- cards.tsx
- dialogs.tsx
- forms.tsx
- tables.tsx
- etc.

##### Feature Components
Organized by user role and functionality:

```
components/
├── admin/              # Admin-only features
│   ├── AssetForm.tsx
│   ├── AssetList.tsx
│   ├── Dashboard.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── employee/           # Employee-specific features
│   ├── AssetRequestForm.tsx
│   ├── EmployeeDashboard.tsx
│   ├── MyAssets.tsx
│   └── MyRequests.tsx
├── shared/             # Shared layouts
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   └── NavButton.tsx
└── ui/                 # Base UI components
    └── ...
```

#### `/src/app/` - Pages & Layouts
Pages and route layouts following Next.js App Router conventions:

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page (/)
├── globals.css         # Global styles
└── employee/
    └── page.tsx        # Employee dashboard (/employee)
```

### 3. `/src/config/` - Configuration
Application-wide configuration and constants:

```typescript
// constants.ts
export const ASSET_CATEGORIES = ['Computer', 'Laptop', ...];
export const USER_ROLES = { ADMIN: 'admin', ... };
```

### 4. `/src/lib/` - Core Utilities

```
lib/
├── mongodb.ts          # Database connection manager
└── utils.ts            # Utility functions (cn, formatCurrency, etc.)
```

**mongodb.ts** - Handles MongoDB connection with caching:
```typescript
import mongoose from 'mongoose';
export default async function dbConnect() { ... }
```

**utils.ts** - Helper functions:
```typescript
export function cn(...inputs) { ... }
export function formatCurrency(amount) { ... }
```

### 5. `/src/models/` - Database Models (Mongoose Schemas)

MongoDB schema definitions using Mongoose ODM:

```
models/
├── Asset.ts           # Asset schema & model
├── User.ts            # User schema & model
├── Organization.ts    # Organization schema & model
├── AssetRequest.ts    # Request schema & model
├── Maintenance.ts     # Maintenance records
└── AuditLog.ts        # Activity logs
```

**Schema Structure:**
```typescript
import mongoose, { Schema, Model } from 'mongoose';

const AssetSchema = new Schema({
  assetTag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // ... more fields
}, { timestamps: true });

export default mongoose.models.Asset || 
  mongoose.model('Asset', AssetSchema);
```

### 6. `/src/types/` - TypeScript Type Definitions

Shared TypeScript interfaces and types:

```typescript
// index.ts
export interface IAsset {
  _id: string;
  assetTag: string;
  name: string;
  // ...
}

export type AssetStatus = 'available' | 'assigned' | 'maintenance';
export interface ApiResponse<T> { ... }
```

### 7. `/src/middleware.ts` - Next.js Middleware
Global middleware for authentication, redirects, etc.:

```typescript
export function middleware(request: NextRequest) {
  // Auth checks, redirects, headers
  return NextResponse.next();
}
```

## Data Flow Architecture

### Server Action Flow
```
Component → Server Action → Database → Response → Revalidate → UI Update
```

### API Route Flow
```
HTTP Request → API Route → Database → JSON Response → Client Processing
```

## File Naming Conventions

1. **React Components**: PascalCase (e.g., `AssetForm.tsx`)
2. **Utilities/Actions**: camelCase (e.g., `createAsset`)
3. **API Routes**: `route.ts` (Next.js convention)
4. **Models**: PascalCase (e.g., `Asset.ts`)
5. **Types/Interfaces**: PascalCase with 'I' prefix (e.g., `IAsset`)

## Import Path Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import dbConnect from '@/lib/mongodb';
import { IAsset } from '@/types';
import Asset from '@/models/Asset';
```

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Separate business logic from UI
- Use composition over inheritance

### 2. Server vs Client
- Mark server actions with `'use server'`
- Mark client components with `'use client'`
- Keep server logic separate from client logic

### 3. Database Operations
- Always use `dbConnect()` before queries
- Use lean() for read-only operations
- Implement proper error handling

### 4. Type Safety
- Define interfaces for all data structures
- Use TypeScript strict mode
- Avoid `any` types

### 5. Environment Variables
- Never commit `.env.local`
- Use NEXT_PUBLIC_ prefix for client-side vars
- Keep sensitive data server-side only

## Directory Growth Strategy

As the project grows:

1. **More Features**: Create feature-based folders in `/components/`
2. **More API Endpoints**: Add versioning (e.g., `/api/v1/`, `/api/v2/`)
3. **More Models**: Keep models flat, use subdirectories only if necessary
4. **Shared Logic**: Extract to `/lib/` or `/utils/`
5. **Tests**: Create `__tests__/` folders next to source files

## Common Patterns

### Creating a New Feature

1. Define types in `/types/`
2. Create model in `/models/`
3. Create server actions in `/actions/`
4. Create API routes in `/app/api/`
5. Create UI components in `/app/components/`
6. Create pages in `/app/`

### Adding a New Entity

Example: Adding "Department" entity:

```
1. types/index.ts → interface IDepartment
2. models/Department.ts → Schema & Model
3. actions/departments.ts → CRUD operations
4. app/api/departments/route.ts → API endpoints
5. app/components/admin/DepartmentForm.tsx → UI
6. app/admin/departments/page.tsx → Page
```

## Performance Considerations

1. **Database Queries**: Use indexes, populate selectively
2. **API Routes**: Implement pagination for large datasets
3. **Components**: Use React.memo for expensive renders
4. **Images**: Use Next.js Image component
5. **Caching**: Leverage Next.js caching strategies

## Security Checklist

- ✅ Environment variables secured
- ✅ Passwords hashed (bcryptjs)
- ✅ Input validation (server-side)
- ✅ MongoDB injection protection (Mongoose)
- ✅ API rate limiting (to implement)
- ✅ CORS configuration (to implement)
- ✅ Authentication (to implement)

## Summary

This structure provides:
- **Separation of Concerns**: Frontend, backend, and data layers are distinct
- **Scalability**: Easy to add new features and entities
- **Maintainability**: Clear organization and naming conventions
- **Type Safety**: Full TypeScript support across the stack
- **Performance**: Optimized for Next.js App Router features
