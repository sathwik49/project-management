# ProManSys — Project Management System

A full-stack project management application built with React, Node.js, Express, and Prisma. Organize your work into workspaces, manage projects, assign tasks, and collaborate with your team.

---

## Tech Stack

**Frontend** — React, TypeScript, Vite, TailwindCSS, TanStack Query, React Router, Shadcn/UI

**Backend** — Node.js, Express, TypeScript, Prisma, PostgreSQL, Passport.js

**Auth** — Session-based auth with email/password and Google OAuth

---

## Project Structure

```
proMansys/
├── frontend/          # React frontend
├── backend/          # Express backend
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (optional)
- Resend API key (for email verification)

### 1. Clone the repo

```bash
git clone https://github.com/sathwik49/project-management
cd project-management
```

### 2. Setup backend

```bash
cd backend
pnpm install
cp .env.example .env
# Fill in your environment variables
pnpm run db:generate
pnpm run db:push
pnpm run seed:roles
npm run dev
```

### 3. Setup frontend

```bash
cd client
pnpm install
cp .env.example .env
# Fill in your environment variables
pnpm run dev
```

---

## Features

- Email/password registration with email verification
- Google OAuth login
- Create and manage multiple workspaces
- Invite team members via invite link
- Role-based permissions (Owner, Admin, Member)
- Create, update, and delete projects
- Create tasks with status, priority, due date, and assignee
- Filter tasks by status, priority, assignee, keyword, and due date
- Workspace and project analytics
- Switch between workspaces from the header
- Responsive dashboard with stats, recent projects, and quick links

---

## Environment Variables

See `/backend/.env.example` and `/frontend/.env.example` for required variables.

---

## License

MIT
