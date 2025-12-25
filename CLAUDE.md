# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Chinese-language AI platform** for the Latin American market, built as a monorepo with:
- **Frontend**: Next.js 16 app ( `/ai-latam-platform` ) - runs on port 7240
- **Backend**: Express + Prisma API ( `/ai-latam-platform/backend` ) - runs on port 3001
- **Database**: Supabase PostgreSQL
- **Scripts**: Content aggregation scripts in `/ai-latam-platform/scripts`

### Tech Stack

**Frontend:**
- Next.js 16 (App Router) with React 19
- TypeScript 5
- Tailwind CSS v4
- Supabase client (`@supabase/supabase-js`)
- Custom fonts: Fraunces (display), Space Grotesk (body), Manrope (UI)

**Backend:**
- Node.js with Express
- TypeScript 5.7
- Prisma ORM
- Express-validator for input validation

### Key Features

1. **AI Tools Directory**: Curated list with filtering and affiliate links
2. **Prompt Library**: Organized templates for various AI platforms
3. **Blog Section**: With Supabase Realtime live updates
4. **Admin Panel**: CRUD operations with mock data fallback
5. **Content Aggregation**: Automated scripts for fetching fresh content

## Project Structure

### Frontend Architecture

```
ai-latam-platform/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── tools/        # Tools listing page
│   │   ├── prompts/      # Prompts library page
│   │   ├── blog/         # Blog posts page (with Supabase Realtime)
│   │   └── admin/        # Admin CRUD dashboard (uses mock data fallback)
│   ├── components/       # Reusable UI components
│   └── lib/              # Utilities
│       ├── supabase.ts   # Supabase client (for direct DB queries)
│       └── mock-data.ts  # Dummy data for development/demo
├── package.json          # Frontend dependencies
└── next.config.ts        # Next.js configuration
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
│   └── server.ts               # Express app entry point with CORS
├── Procfile                    # Render deployment config
├── render.yaml                 # Render service specification
└── package.json                # Backend dependencies
```

### Content Aggregation Scripts

```
scripts/
├── fetch-ai-tools.ts    # Scrape AI tools from Product Hunt
├── fetch-prompts.ts     # Fetch prompt templates
└── fetch-blog-posts.ts  # Aggregate blog posts from RSS feeds
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

### Content Aggregation Scripts (from project root)

```bash
# Set environment variables first
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run scripts
npx tsx scripts/fetch-ai-tools.ts
npx tsx scripts/fetch-prompts.ts
npx tsx scripts/fetch-blog-posts.ts
```

**Note**: Scripts require `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) for write operations.

## Data Flow Architecture

### Hybrid API Pattern

The application uses a **fallback-first architecture** for data fetching:

```
Frontend Page → Backend API → Supabase
                    ↓ (fails/empty)
                Direct Supabase Query → Mock Data
```

**Why this matters**:
- Backend API (port 3001) is the primary path
- Frontend can query Supabase directly if backend is unavailable
- Mock data ensures pages work during development

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

### Supabase Realtime (Blog Page)

The blog page uses Supabase Realtime for live updates:
- `RealtimePostsProvider` - Manages subscription
- `RealtimePostsList` - Client component for live updates
- Listens for `INSERT` events on `posts` table
- Auto-updates when new posts are added to database

### Page-Specific Theming

Each page has unique accent colors (defined in Tailwind config):
- **Landing**: Purple gradient
- **Tools**: Blue theme
- **Prompts**: Emerald theme
- **Blog**: Amber theme
- **Admin**: Slate theme

## API Endpoints

All backend routes are prefixed with `/api/`:

| Resource | GET List | GET Detail | POST | PUT | DELETE |
|----------|----------|------------|------|-----|--------|
| Tools | `/api/tools?tag=&category=&featured=` | `/api/tools/:id` | `/api/tools` | `/api/tools/:id` | `/api/tools/:id` |
| Prompts | `/api/prompts?category=` | `/api/prompts/:id` | `/api/prompts` | `/api/prompts/:id` | `/api/prompts/:id` |
| Posts | `/api/posts?tag=` | `/api/posts/:id` | `/api/posts` | `/api/posts/:id` | `/api/posts/:id` |

Health check: `GET /health` - Returns `{"status":"ok","timestamp":"..."}`

## Database Schema

Three main tables in PostgreSQL (Supabase):

### `tools`
- `id`, `name`, `tag` (required)
- `category`, `description`, `price`, `url`, `affiliate_link`, `logo_url`, `image_url` (nullable)
- `gallery` (JSON array, nullable)
- `is_featured` (boolean, default false)
- `created_at` (auto)

### `prompts`
- `id`, `title`, `category`, `prompt` (required)
- `platforms` (JSON array of strings, required)
- `preview`, `cover_image` (nullable)
- `created_at` (auto)

### `posts`
- `id`, `title`, `published_at` (required)
- `excerpt`, `tag`, `read_time`, `content` (nullable)
- `source_url`, `cover_image` (nullable)
- `gallery` (JSON array, nullable)
- `created_at` (auto)

Indexes exist on filter fields (tag, category, is_featured, published_at).

## Environment Variables

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # Optional, defaults to localhost:3001
```

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
PORT=3001
FRONTEND_URL=http://localhost:7240  # For CORS whitelist
```

**Important**: When setting `DATABASE_URL`, URL-encode special characters in password (e.g., `@` → `%40`).

For production with Supabase, use Supavisor mode (port 6543):
```
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0&sslmode=require"
```

## CORS Configuration

Backend ([`backend/src/server.ts`](ai-latam-platform/backend/src/server.ts)) uses environment-aware CORS:
- `FRONTEND_URL` env variable controls allowed origins
- Falls back to `http://localhost:7240` if not set
- Logs blocked origins for debugging
- Allows requests without origin (mobile apps, Postman)

## Deployment

### Production Stack
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (Express)
- **Database**: Supabase

### Quick Deploy

**Backend to Render**:
1. Push code to GitHub
2. Create Web Service on Render.com
3. Set environment variables: `DATABASE_URL`, `DIRECT_URL`, `PORT=3001`, `FRONTEND_URL`
4. Deploy - get URL like `https://xxx.onrender.com`
5. Run migrations: `npx prisma migrate deploy`

**Frontend to Vercel**:
1. Push code to GitHub
2. Import project on Vercel.com
3. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL` (backend Render URL)
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

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

### Adding a new content source

Edit the aggregation scripts in `scripts/`:
1. Add new fetch function following existing pattern
2. Implement deduplication logic
3. Use `SUPABASE_SERVICE_ROLE_KEY` for write operations
4. Test locally with `npx tsx scripts/filename.ts`

See [`scripts/README.md`](ai-latam-platform/scripts/README.md) for detailed guide.

## Content Localization

**All user-facing content is in Chinese**. When adding new content:
- Use Simplified Chinese for UI text
- Keep code comments in English or Chinese as appropriate
- Maintain consistent terminology across pages
