# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 7240)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

**Important**: Development server runs on port **7240**, not the default 3000.

## Project Overview

This is a **Chinese-language AI platform** for the Latin American market, featuring:
- AI tools directory with affiliate links
- Curated prompt library for various AI platforms
- Blog/insights section for AI trends and tutorials
- Email subscription integration (Tally forms)
- Supabase backend with graceful fallback to local data

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Fonts**: Fraunces (display), Space Grotesk (body), Manrope (UI)

## Architecture Patterns

### Page Structure

All pages follow this consistent pattern:
1. **Server Components** by default with `export const dynamic = "force-dynamic"` for data-driven pages
2. **Data fetching** with graceful fallback to local dummy data
3. **Page-specific accent colors** using CSS variables (`--accent`, `--accent-glow`, `--accent-contrast`)

Example accent colors per page:
- Homepage (`/`): `#ccff00` (green)
- Tools (`/tools`): `#66E0FF` (blue)
- Prompts (`/prompts`): `#C38BFF` (purple)
- Blog (`/blog`): `#FFB347` (orange)

### Data Fetching Pattern

```typescript
// Standard pattern for database queries
async function getItems() {
  const { data, error } = await supabase
    .from("table_name")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return DUMMY_ITEMS; // Fallback to local data
  }

  return data.map((row) => ({
    id: row.id,
    // Map fields...
  }));
}
```

**Always implement fallback data** when connecting to Supabase.

### Database Schema

Current Supabase tables (check Supabase dashboard for actual schema):
- `tools` - AI tools with name, tag, description, price, url
- `prompts` - Prompts with title, category, platforms[], preview, prompt
- `posts` - Blog posts with title, excerpt, tag, read_time, published_at

### Component Patterns

**Shared Components** (in `src/components/`):
- `Nav` - Navigation with path-aware highlighting
- `ThemeToggle` - Brightness/theme switcher with localStorage persistence
- `StickyFilterBar` - Filter bar with Intersection Observer sticky behavior

**Page-Specific Components**:
- `prompts/prompt-grid.tsx` - Client component for prompt display with modal

### Styling Conventions

**Tailwind CSS v4** is used with these patterns:

1. **Dark theme base**: All pages use `bg-[#0d1714]` background
2. **Gradient overlays**: Consistent use of radial gradients + background image
3. **Accent color system**: CSS variables passed via inline styles for page theming
4. **Card styling**: `bg-[#1a2622]` with `shadow-[0_24px_60px_rgba(0,0,0,0.45)]`
5. **Button styles**: Use accent color variables for primary actions

**Global styles** in `globals.css`:
- `.category-filter-bar` - Filter chip container
- `.filter-chip` - Individual filter buttons
- `.brightness-overlay` - Theme-dependent brightness overlay

### Font Usage

```tsx
// Display headings (larger titles)
[font-family:var(--font-display)]

// UI elements and body text
[font-family:var(--font-eco)]
```

## Environment Configuration

Required environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: The current `.env.local` contains a malformed anon key (`sb_publishable_...`). Proper Supabase anon keys are JWT tokens starting with `eyJ`.

## Key Integration Points

### Tally Forms
Embedded on homepage for email subscription:
```tsx
<iframe
  data-tally-src="https://tally.so/embed/ODlo4a?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
  // ...
/>
```
Requires: `<Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />`

### Supabase Client
Centralized configuration in `src/lib/supabase.ts`:
```typescript
export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Content Localization

**All user-facing content is in Chinese**. When adding new content:
- Use Simplified Chinese for UI text
- Keep code comments in English or Chinese as appropriate
- Maintain consistent terminology across pages

## Common Patterns

### Adding a New Page

1. Create page in `src/app/[page-name]/page.tsx`
2. Set page-specific accent color via inline styles
3. Use `Nav` component with appropriate `currentPath`
4. Implement data fetching with fallback pattern
5. Follow consistent layout: Hero → Filters → Content Grid

### Adding Interactive Features

Features requiring interactivity (state, events) need:
1. Extract to separate component with `"use client"` directive
2. Keep server component for data fetching
3. Pass data as props from server to client component

### Styling New Components

- Use existing color palette from globals.css
- Apply accent color variables for theming
- Follow card/button patterns from existing components
- Test responsive behavior (mobile-first approach)
