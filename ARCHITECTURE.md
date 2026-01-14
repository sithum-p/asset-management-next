# Asset Management System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Browser)                         │
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Admin Panel  │  │   Employee   │  │ Org Admin    │                  │
│  │  Dashboard   │  │   Dashboard  │  │   Dashboard  │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│         │                  │                  │                          │
│         └──────────────────┴──────────────────┘                          │
│                            │                                              │
└────────────────────────────┼──────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                                │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    Pages & Routing                             │      │
│  │  /app/page.tsx                                                │      │
│  │  /app/employee/page.tsx                                       │      │
│  │  /app/admin/*/page.tsx                                        │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                             │                                             │
│         ┌───────────────────┴───────────────────┐                       │
│         ▼                                        ▼                       │
│  ┌────────────────┐                    ┌─────────────────┐             │
│  │ Server Actions │                    │   API Routes    │             │
│  │ /actions/*     │                    │   /app/api/*    │             │
│  │                │                    │                 │             │
│  │ - assets.ts    │                    │ - /assets       │             │
│  │ - users.ts     │                    │ - /users        │             │
│  │ - orgs.ts      │                    │ - /organizations│             │
│  │ - requests.ts  │                    │ - /requests     │             │
│  └────────────────┘                    └─────────────────┘             │
│         │                                        │                       │
│         └───────────────────┬────────────────────┘                       │
└─────────────────────────────┼──────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                    │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    Mongoose Models                             │      │
│  │  /models/                                                     │      │
│  │  ├── Organization.ts  (Company/org info)                     │      │
│  │  ├── User.ts          (Users & employees)                    │      │
│  │  ├── Asset.ts         (Asset inventory)                      │      │
│  │  ├── AssetRequest.ts  (Employee requests)                    │      │
│  │  ├── Maintenance.ts   (Maintenance records)                  │      │
│  │  └── AuditLog.ts      (Activity logs)                        │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                             │                                             │
│                             ▼                                             │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                      MongoDB Database                          │      │
│  │                                                                │      │
│  │  Collections:                                                  │      │
│  │  - organizations                                               │      │
│  │  - users                                                       │      │
│  │  - assets                                                      │      │
│  │  - assetrequests                                              │      │
│  │  - maintenances                                               │      │
│  │  - auditlogs                                                  │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### Pattern 1: Server Action Flow (Recommended for Mutations)
```
User Interaction (Form Submit)
    │
    ▼
React Component (Client)
    │
    ▼
Server Action (/actions/*.ts)
    │
    ├─→ Validation
    ├─→ Database Query (Mongoose Model)
    ├─→ Business Logic
    └─→ Revalidate Cache
    │
    ▼
Response to Client
    │
    ▼
UI Update (Optimistic or Re-render)
```

### Pattern 2: API Route Flow (For External/Complex Queries)
```
HTTP Request (fetch/axios)
    │
    ▼
API Route (/app/api/*/route.ts)
    │
    ├─→ Query Parameters Parsing
    ├─→ Validation
    ├─→ Database Query
    └─→ Pagination/Filtering
    │
    ▼
JSON Response
    │
    ▼
Client Processing
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│ Next.js 15+          │ React framework & routing            │
│ React 19             │ UI library                           │
│ TypeScript           │ Type safety                          │
│ Tailwind CSS         │ Styling                              │
│ shadcn/ui            │ Component library                    │
│ Lucide React         │ Icons                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│ Next.js API Routes   │ RESTful API endpoints                │
│ Server Actions       │ Server-side mutations                │
│ Mongoose             │ MongoDB ODM                          │
│ bcryptjs             │ Password hashing                     │
│ Zod                  │ Schema validation (optional)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
├─────────────────────────────────────────────────────────────┤
│ MongoDB              │ NoSQL database                       │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App Root (layout.tsx)
│
├── Home Page (page.tsx)
│
├── Admin Routes
│   ├── Dashboard
│   │   └── Stats, Charts, Recent Activity
│   ├── Assets
│   │   ├── AssetList
│   │   ├── AssetForm (Create/Edit)
│   │   └── AssetDetail
│   ├── Employees
│   │   ├── EmployeeList
│   │   ├── EmployeeForm
│   │   └── EmployeeDetail
│   ├── Organizations
│   │   ├── OrganizationList
│   │   ├── OrganizationForm
│   │   └── OrganizationDetail
│   ├── Requests
│   │   └── AssetRequests (Approve/Reject)
│   ├── Reports
│   │   └── Analytics & Exports
│   └── Settings
│
└── Employee Routes
    ├── Dashboard
    │   └── Overview, Quick Actions
    ├── My Assets
    │   └── Assigned Assets List
    └── My Requests
        ├── Request History
        └── New Request Form
```

## Database Schema Relationships

```
Organization
    │
    ├──→ Has Many: Users (employees, admins)
    │       │
    │       └──→ Has Many: Assets (assigned to user)
    │       └──→ Has Many: AssetRequests (requested by user)
    │
    └──→ Has Many: Assets (owns)
            │
            ├──→ Has Many: Maintenance Records
            └──→ Referenced in: AssetRequests

AuditLog
    └──→ References: Organization, User, Assets, etc.
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Input Validation (Client & Server)                 │
│  - Form validation                                           │
│  - Type checking (TypeScript)                               │
│  - Schema validation (Zod - optional)                       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Authentication (To be implemented)                  │
│  - NextAuth.js / JWT                                        │
│  - Session management                                       │
│  - Protected routes                                         │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Authorization (Role-based)                         │
│  - Admin: Full access                                       │
│  - Org Admin: Organization scope                           │
│  - Employee: Limited access                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Data Security                                      │
│  - Password hashing (bcryptjs)                              │
│  - MongoDB injection protection (Mongoose)                  │
│  - Environment variables (.env.local)                       │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                          │
└─────────────────────────────────────────────────────────────┘

Frontend & API:
┌──────────────┐
│   Vercel     │  ← Next.js application
│  (Hosting)   │     - Serverless functions
└──────────────┘     - Edge network
      │              - Automatic HTTPS
      │
      ▼
┌──────────────┐
│ MongoDB      │  ← Database
│   Atlas      │     - Cloud-hosted
│  (Database)  │     - Automatic backups
└──────────────┘     - Global clusters

Alternative:
┌──────────────┐     ┌──────────────┐
│   Railway    │────→│   MongoDB    │
│    or        │     │    Atlas     │
│   Render     │     │      or      │
│  (Hosting)   │     │   Railway    │
└──────────────┘     └──────────────┘
```

## File Organization Strategy

```
By Feature (Recommended for scaling):
/components/
  /assets/
    AssetCard.tsx
    AssetForm.tsx
    AssetList.tsx
  /requests/
    RequestCard.tsx
    RequestForm.tsx
  /shared/
    Layout.tsx
    Sidebar.tsx

By Type (Current):
/components/
  /admin/
    *.tsx
  /employee/
    *.tsx
  /ui/
    *.tsx
```

## API Design Pattern

```
RESTful Endpoints:

Resource: /api/assets
├── GET     /           List all (with filters)
├── POST    /           Create new
├── GET     /:id        Get single
├── PUT     /:id        Update
└── DELETE  /:id        Delete

Query Parameters:
?page=1
&limit=10
&status=available
&category=Laptop
&organizationId=123
&search=dell
```

## State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ Server State (Database)                                      │
│  - Managed by: Server Actions + API Routes                  │
│  - Cached by: Next.js automatic caching                     │
│  - Revalidated by: revalidatePath()                         │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Client State (UI)                                           │
│  - Managed by: React useState, useReducer                   │
│  - Forms: React Hook Form (optional)                        │
│  - Global: React Context (if needed)                        │
└─────────────────────────────────────────────────────────────┘
```

## Development Workflow

```
1. Define Types (/types/index.ts)
        │
        ▼
2. Create Model (/models/*.ts)
        │
        ▼
3. Create API Routes (/app/api/*/route.ts)
        │
        ▼
4. Create Server Actions (/actions/*.ts)
        │
        ▼
5. Build UI Components (/app/components/*)
        │
        ▼
6. Create Pages (/app/*/page.tsx)
        │
        ▼
7. Test & Deploy
```

This architecture provides a solid foundation for a scalable, maintainable asset management system with clear separation of concerns and modern best practices.
