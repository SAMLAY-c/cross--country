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
6. **Learning Section** (`/learning`): AI technology notes with Markdown editor and Realtime sync

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
│   │   ├── learning/     # Learning notes page with Markdown editor (Realtime)
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

### Starting the Full Stack

**Quick start both services** (from project root):
```bash
# Terminal 1: Frontend
cd ai-latam-platform
npm run dev          # Runs on http://localhost:7240

# Terminal 2: Backend
cd ai-latam-platform/backend
npm run dev          # Runs on http://localhost:3001
```

**Health checks:**
```bash
curl http://localhost:3001/health  # Backend health check
curl http://localhost:7240          # Frontend should return 200
```

### Frontend (from `/ai-latam-platform`)

```bash
npm run dev          # Start Next.js dev server on port 7240
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (from `/ai-latam-platform/backend`)

```bash
cd ai-latam-platform/backend
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

### Content Aggregation Scripts (from `/ai-latam-platform`)

```bash
cd ai-latam-platform

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
- **Tools**: Blue theme (`#66E0FF`)
- **Prompts**: Emerald theme (`#C38BFF`)
- **Blog**: Amber theme (`#FFB347`)
- **Learning**: Yellow theme (`#d4ff00`)
- **Admin**: Slate theme

### Component Architecture Patterns

**Server Components by Default:**
- Use `export const dynamic = "force-dynamic"` for dynamic routes
- Server components handle data fetching and initial rendering
- Pass serialized data to client components

**Client Components for Interactivity:**
- Extract interactive logic to separate files with `"use client"` directive
- Use context providers (`RealtimePostsProvider`, `RealtimeLearningNotesProvider`) for shared state
- Implement graceful degradation - Realtime failures should not break UI

**Example Pattern:**
```typescript
// Server component fetches data
export default async function Page() {
  const data = await fetchData()
  return <InteractiveClientComponent initialData={data} />
}

// Client component handles interactivity
"use client"
export function InteractiveClientComponent({ initialData }) {
  // Interactive logic here
}
```

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

### `learning_notes` (New - Learning Content)
- `id`, `title`, `slug`, `category`, `summary`, `tags` (required)
- `cover_image`, `content`, `updated_at` (nullable)
- **Realtime**: Full CRUD operations with Supabase Realtime
- **Note**: Not yet in Prisma schema - uses direct Supabase queries

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

## Key Development Patterns

### 1. Error Handling Strategy
**Silent degradation is critical:**
- Supabase Realtime failures should console.warn, not throw
- API failures fall back to mock data seamlessly
- User gets working UI with warnings, not broken pages
- Example: Realtime subscriptions wrap channel.subscribe in try/catch

### 2. Data Fetching Pattern
```typescript
async function getData() {
  try {
    // Try backend API first
    const response = await fetch(`${API_BASE}/api/resource`)
    if (!response.ok) throw new Error("API failed")
    return await response.json()
  } catch {
    try {
      // Fallback: Direct Supabase query
      const { data } = await supabase.from("table").select("*")
      return data
    } catch {
      // Final fallback: Mock data
      return DUMMY_DATA
    }
  }
}
```

### 3. Styling Conventions
**Tailwind v4 with CSS variables:**
- Use `--accent`, `--accent-glow`, `--accent-contrast` for theming
- Radial gradients for hero sections: `bg-[radial-gradient(ellipse_at_top,_var(--accent-glow))]
`
- Brightness overlays for dark mode: `brightness-[0.85] dark:brightness-75`
- Consistent shadows: `shadow-lg shadow-black/20`
- Card hover effects: `hover:scale-105 transition-transform duration-300`

### 4. Prisma Naming Convention
**Database camelCase vs API snake_case:**
- Prisma models: `Tool`, `Prompt`, `Post`
- DB columns: camelCase in schema (`createdAt`), mapped to snake_case in DB (`created_at`)
- API responses: snake_case (to match Supabase)
- Frontend: Use whichever matches the data source

### 5. Working with JSON Fields
**For `platforms`, `gallery` fields:**
```typescript
// In Prisma queries
const prompt = await prisma.prompt.findFirst()
const platforms = prompt.platforms as string[] // Cast to array

// In Supabase queries
const { data } = await supabase.from("prompts").select("platforms")
// Automatically parsed as JSON array
```

### 6. Supabase Realtime Implementation
**Pattern for realtime features:**
```typescript
"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function RealtimeComponent() {
  const [data, setData] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Subscribe to changes
    const channel = supabase
      .channel("table_changes")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "your_table"
      }, (payload) => {
        setData(prev => [...prev, payload.new])
      })
      .subscribe((status) => {
        if (status === "SUBSCRIPTION_ERROR") {
          console.warn("Realtime subscription failed")
          setError("实时同步失败，使用手动刷新")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <div>{/* render data */}</div>
}
```

**Critical:** Always implement cleanup and error handling for Realtime subscriptions.

## Troubleshooting

### Backend fails to start
1. Check if port 3001 is already in use: `lsof -ti:3001`
2. Verify DATABASE_URL is correctly set in `backend/.env`
3. Run `npm run prisma:generate` to ensure Prisma Client is generated
4. Check Supabase connection: Test with `psql` connection string

### Frontend shows mock data warning
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Look for CORS errors in browser console
4. Verify backend logs for request errors

### Supabase Realtime not working
1. Check Replication settings in Supabase Dashboard
2. Verify table has Realtime enabled
3. Check browser console for WebSocket errors
4. Ensure anon key has correct permissions

### Database changes not reflecting
```bash
cd ai-latam-platform/backend
npx prisma generate        # Regenerate Prisma Client
npx prisma migrate dev     # Apply new migrations
npm run dev               # Restart backend
```

### Port conflicts
```bash
# Kill processes on specific ports
kill -9 $(lsof -ti:7240)  # Frontend
kill -9 $(lsof -ti:3001)  # Backend
```

## Quick Reference

### File Locations
- **Frontend pages**: `/ai-latam-platform/src/app/`
- **Components**: `/ai-latam-platform/src/components/`
- **Backend API**: `/ai-latam-platform/backend/src/`
- **Database schema**: `/ai-latam-platform/backend/prisma/schema.prisma`
- **Mock data**: `/ai-latam-platform/src/lib/mock-data.ts`
- **Supabase client**: `/ai-latam-platform/src/lib/supabase.ts`

### Key URLs (Development)
- Frontend: http://localhost:7240
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health
- Admin panel: http://localhost:7240/admin
- Learning page: http://localhost:7240/learning

### Environment Variable Checklist
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `DATABASE_URL` - PostgreSQL connection string (backend)
- [ ] `DIRECT_URL` - Direct PostgreSQL connection (backend)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - For admin operations (scripts only)

### Common Prisma Commands
```bash
npx prisma generate       # Generate Prisma Client from schema
npx prisma migrate dev    # Create and apply new migration
npx prisma migrate deploy # Apply migrations in production
npx prisma studio         # Open Prisma Studio (GUI)
npx prisma migrate reset  # Reset database (DESTRUCTIVE)
npx prisma db pull        # Pull schema from database
npx prisma db push        # Push schema to database (dev only)
```

### Database Table Quick Reference
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `tools` | AI tools directory | name, tag, category, is_featured |
| `prompts` | Prompt templates | title, category, platforms (JSON) |
| `posts` | Blog articles | title, published_at, tag, content |
| `learning_notes` | Learning content | title, slug, category, tags (JSON) |

### Page Routes
| Route | Component | Theme Color |
|-------|-----------|-------------|
| `/` | Landing page | Purple |
| `/tools` | AI tools directory | Blue (#66E0FF) |
| `/prompts` | Prompt library | Purple (#C38BFF) |
| `/blog` | Blog posts | Amber (#FFB347) |
| `/learning` | Learning notes | Yellow (#d4ff00) |
| `/admin` | Admin dashboard | Slate |

### Adding a New Feature: Checklist
1. [ ] Create page in `/ai-latam-platform/src/app/feature-name/`
2. [ ] Define theme color in Tailwind config
3. [ ] Add mock data to `/ai-latam-platform/src/lib/mock-data.ts`
4. [ ] Create backend API routes in `/backend/src/`
5. [ ] Update Prisma schema if new table needed
6. [ ] Run `npx prisma migrate dev` and `npx prisma generate`
7. [ ] Implement fallback pattern (API → Supabase → Mock)
8. [ ] Add navigation link in `/ai-latam-platform/src/components/nav.tsx`
9. [ ] Test with backend stopped (verify fallback works)
10. [ ] Add Realtime if needed (follow existing patterns)
