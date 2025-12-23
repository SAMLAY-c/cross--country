# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing:
- **Frontend**: Next.js 16 app ( `/ai-latam-platform` ) - runs on port 7240
- **Backend**: Express + Prisma API ( `/ai-latam-platform/backend` ) - runs on port 3001

### Frontend Architecture

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   ├── tools/        # Tools listing page
│   ├── prompts/      # Prompts library page
│   ├── blog/         # Blog posts page
│   └── admin/        # Admin CRUD dashboard (uses mock data fallback)
├── components/       # Reusable UI components
└── lib/              # Utilities
    ├── supabase.ts   # Supabase client (for direct DB queries)
    └── mock-data.ts  # Dummy data for development/demo
```

### Backend Architecture

```
backend/
├── prisma/
│   └── schema.prisma # Database schema definition
├── src/
│   ├── config/database.ts      # Prisma client singleton
│   ├── controllers/            # Request handlers (tools/prompts/posts)
│   ├── routes/                 # Express route definitions
│   └── server.ts               # Express app entry point
```

## Development Commands

### Frontend (from project root)

```bash
npm run dev          # Start Next.js dev server on port 7240
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (from `/backend` directory)

```bash
cd backend
npm install          # Install dependencies first time

# Environment setup (create .env from .env.example)
cp .env.example .env # Edit DATABASE_URL with Supabase credentials

# Database setup
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations

# Development
npm run dev          # Start Express server on port 3001 (tsx watch mode)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled server

# Database utilities
npm run prisma:studio     # Open Prisma Studio (GUI for DB)
npx prisma migrate reset  # Reset database (destructive)
```

## Data Flow

### Admin Panel (`/admin`)

The admin page has a **mock data fallback system**:
1. Tries to fetch from backend API (`http://localhost:3001`)
2. If API returns empty array OR fails, falls back to `DUMMY_TOOLS/PROMPTS/POSTS` from `mock-data.ts`
3. Shows amber warning when using mock data
4. Disables edit/delete buttons when using mock data

**"导入虚拟数据" button** - Seeds the database with mock data via API calls.

### Frontend Pages (`/tools`, `/prompts`, `/blog`)

Pages fetch data via **two paths** (fallback logic):
1. First: Backend API (`/api/tools`, `/api/prompts`, `/api/posts`)
2. Fallback: Supabase direct query using `@supabase/supabase-js`

## API Endpoints

All backend routes are prefixed with `/api/`:

| Resource | GET List | GET Detail | POST | PUT | DELETE |
|----------|----------|------------|------|-----|--------|
| Tools | `/api/tools?tag=&category=&featured=` | `/api/tools/:id` | `/api/tools` | `/api/tools/:id` | `/api/tools/:id` |
| Prompts | `/api/prompts?category=` | `/api/prompts/:id` | `/api/prompts` | `/api/prompts/:id` | `/api/prompts/:id` |
| Posts | `/api/posts?tag=` | `/api/posts/:id` | `/api/posts` | `/api/posts/:id` | `/api/posts/:id` |

## Database Schema

Three main tables in PostgreSQL (Supabase):

### `tools`
- `id`, `name`, `tag` (required)
- `category`, `description`, `price`, `url`, `affiliate_link`, `logo_url`, `image_url` (nullable)
- `is_featured` (boolean, default false)
- `created_at` (auto)

### `prompts`
- `id`, `title`, `category`, `prompt` (required)
- `platforms` (JSON array of strings, required)
- `preview` (nullable)
- `created_at` (auto)

### `posts`
- `id`, `title`, `published_at` (required)
- `excerpt`, `tag`, `read_time`, `content` (nullable)
- `created_at` (auto)

Indexes exist on filter fields (tag, category, is_featured, published_at).

## Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # Optional, defaults to localhost:3001
```

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
PORT=3001
```

**Important**: When setting `DATABASE_URL`, URL-encode special characters in password (e.g., `@` → `%40`).

## Type Safety

- Backend: TypeScript with Prisma-generated types (`@prisma/client`)
- Frontend: TypeScript with shared type definitions in component files
- Admin page uses inline `Tool`, `Prompt`, `Post` types matching backend response format

## Common Tasks

### After modifying Prisma schema

```bash
cd backend
npx prisma generate        # Regenerate Prisma Client
npx prisma migrate dev     # Create and apply new migration
```

### Resetting database

```bash
cd backend
npx prisma migrate reset   # WARNING: Deletes all data
```

### Seeding initial data

Use admin panel at `/admin` → click "导入虚拟数据" button, or manually POST to API endpoints.
