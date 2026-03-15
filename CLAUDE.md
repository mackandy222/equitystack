# EquityStack Development

## Commands

```bash
bun install          # install dependencies
bun run dev          # start dev server with hot reload
bun test             # run tests
bun test --watch     # run tests in watch mode
bun run build        # build for production
bun run db:migrate   # run database migrations
bun run db:seed      # seed database with sample data
bun run lint         # check code quality
bun run format       # auto-format code
```

## Architecture

Two-sided marketplace: Startups <-> Executives, connected by AI matching.

- **API layer:** Hono routes in `src/api/` — thin handlers that call services
- **Service layer:** Business logic in `src/services/` — matching, equity, legal, accounting
- **Data layer:** Drizzle ORM models in `src/models/` — SQLite for dev, Postgres for prod
- **AI layer:** Anthropic Claude SDK for matching intelligence and document generation

## Key design decisions

- SQLite in dev for zero-config setup, Postgres-compatible schema for production
- All vesting logic is time-based with configurable tranches (not cliff-based)
- Legal agreements use templates with variable substitution, not LLM generation
- Matching engine uses Claude for semantic understanding + deterministic scoring

## Domain concepts

- **Startup:** A company profile with stage, needs, and open roles
- **Executive:** A professional profile with skills, availability, and preferences
- **Match:** A proposed pairing with compatibility score and rationale
- **VestingSchedule:** Equity allocation with time-based tranches
- **Agreement:** Legal document binding startup and executive

## Testing

Tests live alongside source in `test/`. Use `bun test` to run.
Database tests use an in-memory SQLite instance.
