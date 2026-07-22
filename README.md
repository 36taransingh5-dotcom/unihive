# Hive

Hive is a web app for university student societies to publish events and for students to discover them. Societies create an account, post events (with a category, location, time window, and optional food/tags info), and students browse a live feed with filters, a map view, and an AI assistant ("Ask Hive") that answers questions about what's on.

## Key features

- **Event feed** with filtering by category, tags, and other criteria (`AdvancedFilters`, `FilterBar`, `CategorySelect`)
- **Society dashboard** to create, edit, and manage events (`src/pages/Dashboard.tsx`, `src/pages/EventForm.tsx`)
- **Magic Fill**: an edge function (`extract-event-details`) that parses a pasted social-media caption and extracts structured event details using an LLM
- **Ask Hive**: an edge function (`ask-hive`) that answers natural-language questions about the current event list using an LLM, with a chat UI component (`src/components/AskHive.tsx`)
- **Map view** of event locations built with Leaflet/React-Leaflet (`src/components/MiniMap.tsx`)
- **Authentication** (sign up / sign in / sign out) backed by Supabase Auth (`src/hooks/useAuth.tsx`)
- **Light/dark theme** support (`src/hooks/useTheme.tsx`)
- Landing page, login, registration, and a 404 page

## Tech stack

- **Frontend**: React 18 + TypeScript, built with Vite
- **Routing**: React Router
- **UI**: Tailwind CSS, shadcn/ui (Radix UI primitives), lucide-react icons, Framer Motion
- **Data/state**: TanStack Query, React Hook Form + Zod validation
- **Backend**: Supabase (Postgres database, Auth, Edge Functions)
- **Edge functions**: Deno-based Supabase functions (`ask-hive`, `extract-event-details`) calling an LLM via the Lovable AI Gateway (`LOVABLE_API_KEY`)
- **Maps**: Leaflet / React-Leaflet
- **Testing**: Vitest + Testing Library, jsdom
- **Linting**: ESLint (typescript-eslint)
- **Deployment**: Docker (Node 20-alpine, served with `serve`), configured for Railway (Nixpacks/Dockerfile) and Vercel

## Project structure

```
src/
  components/       Shared UI components (event cards, filters, header, Ask Hive chat, map, etc.)
  components/ui/     shadcn/ui primitives
  pages/            Route-level pages (Landing, Login, Register, Dashboard, EventForm, Index, NotFound)
  hooks/            React hooks (auth, theme, data fetching for events/societies)
  integrations/supabase/  Supabase client setup and generated types
  data/             Mock event data used as a fallback/demo dataset
  lib/              Utility helpers
  types/            Shared TypeScript types
  test/             Test setup/utilities
supabase/
  functions/        Edge functions (ask-hive, extract-event-details)
  migrations/       SQL migrations (societies, events tables, seed data)
  config.toml       Supabase project config
public/             Static assets
```

## Setup / installation

Requirements: Node.js 20+ and npm.

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
   (The repo pins `legacy-peer-deps=true` in `.npmrc`, so plain `npm install`/`npm ci` will use that flag automatically.)

2. Create a `.env` file in the project root with your Supabase project credentials:
   ```
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   VITE_SUPABASE_URL=your-supabase-url
   ```

3. (Optional, for the Supabase backend) Apply the SQL migrations in `supabase/migrations/` to your Supabase project, and deploy the edge functions in `supabase/functions/` (each requires a `LOVABLE_API_KEY` environment variable set in the Supabase project for LLM calls).

## Usage / running locally

Start the dev server:
```bash
npm run dev
```

Other scripts:
```bash
npm run build       # Production build to dist/
npm run build:dev    # Development-mode build
npm run preview      # Preview a production build locally
npm run lint         # Run ESLint
npm test             # Run tests once with Vitest
npm run test:watch   # Run tests in watch mode
npm start            # Serve the built dist/ folder (used in Docker/Railway deployment)
```

## Deployment

The app is a static Vite build served by the `serve` package. The included `Dockerfile` builds the app in a Node 20-alpine image and serves `dist/` on `$PORT`. `railway.toml` points Railway at the Dockerfile, `nixpacks.toml` provides an alternative Nixpacks-based build/start config, and `vercel.json` configures security headers and SPA routing for a Vercel deployment.
