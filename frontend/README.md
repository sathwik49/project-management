# ProManSys — Frontend

React + TypeScript frontend for the ProManSys project management system.

---

## Tech Stack

- **Framework** — React 18, TypeScript
- **Build Tool** — Vite
- **Styling** — TailwindCSS, Shadcn/UI
- **Routing** — React Router v6
- **Data Fetching** — TanStack Query v5
- **HTTP Client** — Axios
- **Forms** — React Hook Form + Zod
- **Notifications** — React Hot Toast

---

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   ├── api.ts                    # All API functions
│   │   ├── axios.ts                  # Axios instance
│   │   ├── types.ts                  # API response types
│   │   └── baseUrl.ts                # Base URL config
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardProjects.tsx
│   │   │   ├── DashboardWorkspaces.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DashboardWelcome.tsx
│   │   │   └── WorkspaceSwitcher.tsx
│   │   ├── workspace/
│   │   │   ├── CreateWorkspaceDialog.tsx
│   │   │   └── WorkspaceSettings.tsx
│   │   ├── project/                  # Project sub-components
│   │   ├── task/                     # Task sub-components
│   │   ├── ui/                       # Shadcn/UI components
│   │   ├── AppHeader.tsx             # Global header for all protected routes
│   │   └── logout.tsx
│   ├── hooks/
│   │   ├── useAuthUser.ts
│   │   └── useProjectDetail.ts
│   ├── lib/
│   │   ├── endpoints.ts              # ENDPOINTS + QUERY_KEYS constants
│   │   └── constants.ts
│   ├── pages/
│   │   ├── auth/                     # SignIn, SignUp, VerifyEmail, AuthLayout
│   │   ├── workspace/                # WorkspaceList, WorkspaceDetail, JoinWorkspace
│   │   ├── project/                  # ProjectList, ProjectDetail, ProjectSettings
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── ProtectedPage.tsx
│   │   └── NotFound.tsx
│   ├── providers/
│   │   └── QueryProvider.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx
│   └── validations/
│       └── auth.validation.ts
├── .env.example
└── package.json
```

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:9056/api
```

### 3. Run dev server

```bash
pnpm dev
```

App runs on `http://localhost:5173` by default.

### Other commands

```bash
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

---

## Routes

| Path                                                    | Component         | Auth      |
| ------------------------------------------------------- | ----------------- | --------- |
| `/`                                                     | Home              | Public    |
| `/sign-in`                                              | SignIn            | Public    |
| `/sign-up`                                              | SignUp            | Public    |
| `/verify-email/:token`                                  | VerifyEmail       | Public    |
| `/dashboard`                                            | Dashboard         | Protected |
| `/workspaces`                                           | WorkspaceList     | Protected |
| `/workspaces/:workspaceId`                              | WorkspaceDetail   | Protected |
| `/workspaces/:workspaceId/settings`                     | WorkspaceSettings | Protected |
| `/workspaces/:workspaceId/projects`                     | ProjectList       | Protected |
| `/workspaces/:workspaceId/projects/:projectId`          | ProjectDetail     | Protected |
| `/workspaces/:workspaceId/projects/:projectId/settings` | ProjectSettings   | Protected |
| `/workspace/join/:invite`                               | JoinWorkspace     | Protected |
| `/404`                                                  | NotFound          | Public    |
| `*`                                                     | NotFound          | Public    |

---

## Key Patterns

### API calls

All API functions live in `src/api/api.ts` and use the `ENDPOINTS` constants from `src/lib/endpoints.ts`. Never hardcode URLs in components.

```typescript
// Good
const res = await api.get(ENDPOINTS.WORKSPACE.GET_BY_ID(id));

// Bad
const res = await api.get(`/workspace/${id}`);
```

### Query keys

All TanStack Query keys use `QUERY_KEYS` constants. This ensures cache invalidation works correctly across the app.

```typescript
// Good
queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId);

// Bad
queryKey: ["projects", workspaceId];
```

### Auth

Auth state comes from `useAuthUser` hook which reads from the `QUERY_KEYS.USER.CURRENT` cache. `ProtectedPage` renders `AppHeader` and handles redirecting unauthenticated users — individual pages don't repeat this logic.

```typescript
const { user, isLoading } = useAuthUser();
```

### Mutations

Always invalidate relevant query keys after mutations:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.WORKSPACE.ANALYTICS(workspaceId),
  });
};
```

### Query key conflicts

Some components fetch the same resource with different params. Use suffix keys to avoid cache collisions:

```typescript
// DashboardStats — needs only totalCount, pageSize: 1
queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId), "stats"];

// DashboardProjects — needs actual projects, pageSize: 6
queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId), "dashboard"];

// ProjectList — full list
queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId);
```

### Workspace switching

When the user switches workspace via `WorkspaceSwitcher`, the following are invalidated and the user is navigated based on current route:

- `/dashboard` → stays on dashboard, data refetches
- `/workspaces/*` or `/projects/*` → navigates to new workspace's equivalent page

