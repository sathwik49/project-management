# ProManSys — Backend

Express + Prisma REST API for the ProManSys project management system.

---

## Tech Stack

- **Runtime** — Node.js 18+
- **Framework** — Express.js
- **Language** — TypeScript
- **ORM** — Prisma
- **Database** — PostgreSQL
- **Auth** — Passport.js (Local + Google OAuth), express-session
- **Email** — Resend + React Email
- **Validation** — Zod
- **Rate Limiting** — express-rate-limit

---

## Project Structure

```
server/
├── src/
│   ├── config/          # DB, app config, passport setup
│   ├── controllers/     # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── workspace.controller.ts
│   │   ├── member.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── workspace.service.ts
│   │   ├── member.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── middlewares/     # Auth, error handler, async handler, rate limiter
│   ├── routes/          # Express routers
│   ├── validations/     # Zod schemas
│   ├── utils/           # Helpers, errors, enums, tokens, mailers
│   └── generated/       # Prisma generated client
├── prisma/
│   ├── schema.prisma
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
DATABASE_URL=postgresql://user:password@localhost:5432/promansys
SESSION_SECRET=your_session_secret

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_REDIRECT_URL=http://localhost:5173/dashboard
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/auth/callback

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RESEND_API_KEY=your_resend_api_key
```

### 3. Database setup

```bash
pnpm run db:push
pnpm run db:generate
pnpm run seed:roles
```

### 4. Run dev server

```bash
pnpm run dev
```

Server runs on `http://localhost:9056` by default.

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint               | Description                  | Auth   |
| ------ | ---------------------- | ---------------------------- | ------ |
| POST   | `/register`            | Register with email/password | Public |
| POST   | `/login`               | Login with email/password    | Public |
| POST   | `/logout`              | Logout current session       | Public |
| GET    | `/verify-email/:token` | Verify email address         | Public |
| GET    | `/google`              | Initiate Google OAuth        | Public |
| GET    | `/google/callback`     | Google OAuth callback        | Public |

### User — `/api/user`

| Method | Endpoint | Description                    | Auth     |
| ------ | -------- | ------------------------------ | -------- |
| GET    | `/me`    | Get current authenticated user | Required |

### Workspace — `/api/workspace`

| Method | Endpoint                    | Description              | Auth     |
| ------ | --------------------------- | ------------------------ | -------- |
| POST   | `/`                         | Create workspace         | Required |
| GET    | `/`                         | Get all user workspaces  | Required |
| GET    | `/:workspaceId`             | Get workspace by ID      | Required |
| PATCH  | `/:workspaceId`             | Update workspace         | Required |
| DELETE | `/:workspaceId`             | Delete workspace         | Required |
| GET    | `/:workspaceId/members`     | Get workspace members    | Required |
| GET    | `/:workspaceId/analytics`   | Get workspace analytics  | Required |
| PATCH  | `/switch`                   | Switch current workspace | Required |
| PATCH  | `/:workspaceId/member-role` | Change member role       | Required |

### Member — `/api/member`

| Method | Endpoint            | Description               | Auth     |
| ------ | ------------------- | ------------------------- | -------- |
| POST   | `/join/:inviteCode` | Join workspace via invite | Required |

### Project — `/api/project`

| Method | Endpoint                                                | Description           | Auth     |
| ------ | ------------------------------------------------------- | --------------------- | -------- |
| POST   | `/workspace/:workspaceId/projects`                      | Create project        | Required |
| GET    | `/workspace/:workspaceId/projects`                      | Get all projects      | Required |
| GET    | `/workspace/:workspaceId/projects/:projectId`           | Get project by ID     | Required |
| GET    | `/workspace/:workspaceId/projects/:projectId/analytics` | Get project analytics | Required |
| PATCH  | `/workspace/:workspaceId/projects/:projectId`           | Update project        | Required |
| DELETE | `/workspace/:workspaceId/projects/:projectId`           | Delete project        | Required |

### Task — `/api/task`

| Method | Endpoint                                                    | Description                | Auth     |
| ------ | ----------------------------------------------------------- | -------------------------- | -------- |
| POST   | `/workspace/:workspaceId/projects/:projectId/tasks`         | Create task                | Required |
| GET    | `/workspace/:workspaceId/tasks`                             | Get all tasks in workspace | Required |
| GET    | `/workspace/:workspaceId/projects/:projectId/tasks/:taskId` | Get task by ID             | Required |
| PATCH  | `/workspace/:workspaceId/projects/:projectId/tasks/:taskId` | Update task                | Required |
| DELETE | `/workspace/:workspaceId/tasks/:taskId`                     | Delete task                | Required |

---

## Task Filters

`GET /api/task/workspace/:workspaceId/tasks` accepts query params:

```
projectId     string
status        comma-separated: TODO,IN_PROGRESS,IN_REVIEW,DONE,BACKLOG
priority      comma-separated: LOW,MEDIUM,HIGH
assignedTo    comma-separated user IDs
keyword       string (searches title)
dueDate       ISO date string
pageSize      number (default: 10)
pageNumber    number (default: 1)
```

---

## Response Format

All endpoints return a consistent shape:

```json
{
  "success": true,
  "message": "Description of result",
  "details": {}
}
```

Paginated responses include:

```json
{
  "success": true,
  "message": "...",
  "details": [],
  "pagination": {
    "totalCount": 20,
    "totalPages": 2,
    "pageSize": 10,
    "pageNumber": 1
  }
}
```

Validation errors:

```json
{
  "success": false,
  "message": "Validation Failed",
  "details": [{ "field": "name", "message": "Name is required" }]
}
```

---

## Roles & Permissions

| Permission         | OWNER | ADMIN | MEMBER |
| ------------------ | ----- | ----- | ------ |
| View workspace     | yes   | yes   | yes    |
| Edit workspace     | yes   | yes   | no     |
| Delete workspace   | yes   | no    | no     |
| Create project     | yes   | yes   | no     |
| Edit project       | yes   | yes   | no     |
| Delete project     | yes   | yes   | no     |
| Create task        | yes   | yes   | yes    |
| Edit task          | yes   | yes   | yes    |
| Delete task        | yes   | yes   | no     |
| Change member role | yes   | yes   | no     |
