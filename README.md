# EquityStack

**A two-sided marketplace connecting early-stage startups with experienced executives willing to work for equity.**

Startups with real traction but no cash to hire senior people. Executives and specialists with other income sources willing to commit ~20 hours/month for equity. Both sides actively motivated — which is rare in a marketplace.

## The Problem

Equity-for-services is a mess to execute. Every deal currently involves lawyers, accountants, ad hoc agreements, cap table confusion and tax risk on both sides. It puts people off, or they do it badly, or even if they do it well it takes time away from the rest of the business.

## The Solution

An AI-powered platform that makes the whole thing smooth, fast and trustworthy end to end:

| Feature | What it does |
|---------|-------------|
| **Intelligent Matching** | AI-powered matching based on what the startup needs and what the executive can offer |
| **Automated Vesting** | Configurable vesting schedules (e.g. tranches at 12/24/36/48/60 weeks) |
| **Share Certificates** | Automated share certificate generation and cap table management |
| **Legal Agreements** | Standard legal agreements built in — no lawyers needed for standard terms |
| **Accounting** | Accounting treatment handled automatically for both sides |
| **Tax Guidance** | AI-powered tax guidance for startups and executives |

A founder gets everything they need to bring on a fractional senior finance, technical, commercial, or marketing person on equity terms **in hours, not weeks**. That's the product.

## Target Market

**Startups:** Post-accelerator (Entrepreneur First, Seedcamp, Techstars etc), pre or low revenue, starting to think about raising. They have something real but no cash to hire the senior people they need to grow and fundraise.

**Executives:** Experienced professionals willing to work for equity instead of cash. They have other time commitments and income sources. Time commitment is ~20 hours/month.

## How It Works

1. **Startup signs up** — describes their stage, needs, and what roles they need filled
2. **Executives sign up** — describe their skills, availability, and equity preferences
3. **AI matches** — intelligent matching based on skills, industry, stage fit, and mutual preferences
4. **Trial period** — executives work with the startup; if they don't fit, they're let go before equity vests
5. **Equity vests** — automated vesting schedules, share certificates, and cap table updates
6. **Scale** — startups can bring on multiple fractional senior people simultaneously

## Revenue Model

- **Listing fees** for startups posting roles
- **Subscriptions** for premium matching and platform features
- **Small equity stakes** in each company we place into

Long term this is a serious network effects business.

## The Vision

It's like a DAO but equity instead of tokens, no crypto, and legally sound. Real people growing future companies together in a new and exciting way.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh)
- **API Framework:** [Hono](https://hono.dev)
- **Database:** SQLite via [Drizzle ORM](https://orm.drizzle.team)
- **AI:** [Anthropic Claude](https://anthropic.com) for matching, document generation, and guidance
- **Validation:** [Zod](https://zod.dev)
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment config
cp .env.example .env

# Run database migrations
bun run db:migrate

# Seed with sample data
bun run db:seed

# Start development server
bun run dev
```

The API server runs at `http://localhost:3000`.

## Project Structure

```
equitystack/
├── src/
│   ├── server.ts              # Hono API server entry point
│   ├── config/                # Environment and app configuration
│   ├── models/                # Drizzle ORM schema definitions
│   │   ├── startup.ts         # Startup profiles
│   │   ├── executive.ts       # Executive profiles
│   │   ├── match.ts           # Match records
│   │   ├── vesting.ts         # Vesting schedules and tranches
│   │   └── agreement.ts       # Legal agreements
│   ├── api/                   # API route handlers
│   │   ├── startups/          # Startup CRUD + search
│   │   ├── executives/        # Executive CRUD + search
│   │   ├── matches/           # Matching endpoints
│   │   ├── vesting/           # Vesting management
│   │   └── agreements/        # Agreement generation
│   ├── services/              # Business logic
│   │   ├── matching/          # AI-powered matching engine
│   │   ├── equity/            # Vesting + cap table logic
│   │   ├── legal/             # Agreement generation
│   │   └── accounting/        # Accounting treatment
│   └── lib/                   # Shared utilities
├── test/                      # Test files
├── scripts/                   # DB migrations, seeds, tooling
└── CLAUDE.md                  # Development guide
```

## License

MIT
