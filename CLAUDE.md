# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit application with Node.js backend for tracking sales pipeline opportunities.

## Domain Model

**Customers** - Organizations in the sales pipeline
- Region: NORTHAM, EMEA, JAPAC, LATAM
- Segment: Select, Enterprise, SMB
- Industry: Media & Entertainment, Financial Services, etc.
- Has zero to many Workloads

**Workloads** - Specific opportunities within a Customer
- Size: dollar value of the opportunity
- Belongs to one Customer

**Events** - History of interactions with a Customer OR a Workload (exactly one, not both)
- `happened_at`: auto-populated timestamp
- Outcome (required): text describing decisions made and blockers to next stage
- Can update stage and/or size of the opportunity
- All changes to stage and size are preserved in history; latest values used for reporting

Pipeline stages:
- 1-Qualifying
- 2-Proof-of-Concept
- 3-Deciding
- 4-Implementation and Migration
- 5-Production
- 90-Stale
- 91-Disqualified
- 92-Lost
- 99-Closed

## Architecture

```
src/
├── lib/
│   ├── types.d.ts              # TypeScript type definitions
│   ├── constants.js            # Stages, regions, segments, formatters
│   ├── components/             # Reusable Svelte components
│   │   ├── CustomerForm.svelte
│   │   ├── WorkloadForm.svelte
│   │   ├── EventForm.svelte
│   │   ├── EntitySearch.svelte # Type-ahead search for customers/workloads
│   │   └── StageSelect.svelte
│   └── server/                 # Server-only code
│       ├── db.js               # PostgreSQL connection pool
│       ├── schema.sql          # Database DDL
│       ├── customers.js        # Customer CRUD operations
│       ├── workloads.js        # Workload CRUD operations
│       └── events.js           # Event CRUD + entity search
└── routes/
    ├── +layout.svelte          # App shell with navigation
    ├── +page.svelte            # Dashboard
    ├── customers/              # Customer CRUD pages
    ├── workloads/              # Workload CRUD pages
    ├── events/new/             # Create event form
    └── api/search/             # Entity search API endpoint
```

**Key patterns:**
- Routes use `[label]` parameter for URL-friendly lookups (labels are mutable, UUIDs are primary keys)
- Workload stage/size derived from latest event (event-sourced)
- Server modules in `$lib/server/` are only accessible from `.server.js` files

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Run svelte-check for type errors
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset schema and reseed
```

## Type System

This project uses **JavaScript with JSDoc type annotations** instead of TypeScript files:

- Write `.js` files, not `.ts` files
- Add TypeScript types via JSDoc comments (`@type`, `@param`, `@returns`, etc.)
- Use `.d.ts` files for complex type definitions and module declarations
- TypeScript is configured for type-checking only (no compilation)

Example:
```javascript
/**
 * @param {string} name
 * @returns {Promise<User>}
 */
export async function getUser(name) {
  // implementation
}
```

## Database Setup

Requires PostgreSQL. Set `DATABASE_URL` environment variable:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pipeline
```

Initialize schema by running `src/lib/server/schema.sql` against your database.

**GitHub Codespaces**: The devcontainer automatically sets up Node.js 22 and PostgreSQL 16, creates the database, and runs the schema. Just open in Codespaces and run `npm run dev`.

## License

Apache License 2.0
