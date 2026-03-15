import { Database } from "bun:sqlite";

const db = new Database("equitystack.db");

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

console.log("Running migrations...");

db.exec(`
  CREATE TABLE IF NOT EXISTS startups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    stage TEXT NOT NULL CHECK(stage IN ('pre_revenue', 'early_revenue', 'post_accelerator', 'pre_seed', 'seed')),
    accelerator TEXT,
    sector TEXT NOT NULL,
    website TEXT,
    founder_name TEXT NOT NULL,
    founder_email TEXT NOT NULL,
    founder_linkedin TEXT,
    team_size INTEGER DEFAULT 1,
    monthly_revenue INTEGER DEFAULT 0,
    funding_raised INTEGER DEFAULT 0,
    pitch_summary TEXT,
    roles_needed TEXT,
    equity_budget INTEGER,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'closed')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS executives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    linkedin TEXT,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT NOT NULL,
    sectors TEXT NOT NULL,
    years_experience INTEGER NOT NULL,
    current_role TEXT,
    hours_per_month INTEGER DEFAULT 20,
    min_equity_bps INTEGER DEFAULT 25,
    max_equity_bps INTEGER DEFAULT 200,
    preferred_stages TEXT,
    available_from TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'unavailable')),
    vetted INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL REFERENCES startups(id),
    executive_id TEXT NOT NULL REFERENCES executives(id),
    role TEXT NOT NULL,
    score REAL NOT NULL,
    rationale TEXT NOT NULL,
    skill_match REAL,
    sector_match REAL,
    stage_match REAL,
    status TEXT DEFAULT 'proposed' CHECK(status IN ('proposed', 'startup_accepted', 'executive_accepted', 'both_accepted', 'trial_active', 'confirmed', 'rejected', 'expired')),
    startup_notes TEXT,
    executive_notes TEXT,
    proposed_at TEXT DEFAULT (datetime('now')),
    accepted_at TEXT,
    trial_started_at TEXT,
    confirmed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS vesting_schedules (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL REFERENCES matches(id),
    total_equity_bps INTEGER NOT NULL,
    vesting_period_weeks INTEGER DEFAULT 60,
    tranche_count INTEGER DEFAULT 5,
    tranche_interval_weeks INTEGER DEFAULT 12,
    start_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'completed', 'terminated')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vesting_tranches (
    id TEXT PRIMARY KEY,
    schedule_id TEXT NOT NULL REFERENCES vesting_schedules(id),
    tranche_number INTEGER NOT NULL,
    equity_bps INTEGER NOT NULL,
    vest_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'vested', 'forfeited')),
    vested_at TEXT,
    certificate_id TEXT
  );

  CREATE TABLE IF NOT EXISTS agreements (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL REFERENCES matches(id),
    type TEXT NOT NULL CHECK(type IN ('equity_grant', 'consulting_agreement', 'nda', 'ip_assignment', 'board_observer')),
    content TEXT NOT NULL,
    template_version TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'signed_startup', 'signed_executive', 'executed', 'voided')),
    startup_signed_at TEXT,
    executive_signed_at TEXT,
    executed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log("Migrations complete.");
