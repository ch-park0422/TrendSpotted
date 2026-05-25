-- ─── TrendSpotted — Supabase Schema ─────────────────────────────────────────
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- or via the Supabase CLI: supabase db push

-- Enable extensions
create extension if not exists "pgcrypto";
-- pg_trgm: 한국어 포함 모든 언어 LIKE/유사도 검색 지원
create extension if not exists "pg_trgm";

-- ─── trends table ─────────────────────────────────────────────────────────────
create table if not exists trends (
  id               text        primary key,          -- e.g. "trend-a1b2c3d4"
  keyword          text        not null,
  category         text        not null
    check (category in ('재테크', '창업/부업', '사이드 프로젝트')),
  rise_rate        integer     not null check (rise_rate >= 0),
  summary          text        not null,

  -- JSONB columns for nested objects (indexed for fast queries)
  trend_context    jsonb       not null default '{}',
  monetization_ideas jsonb     not null default '[]',
  target_audience  jsonb       not null default '{}',

  -- Engagement counters (never overwritten by cron — use separate RPC)
  view_count       integer     not null default 0,
  bookmark_count   integer     not null default 0,

  updated_at       timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- Fast category filtering (main dashboard tab queries)
create index if not exists trends_category_idx
  on trends (category);

-- Order by recency
create index if not exists trends_updated_at_idx
  on trends (updated_at desc);

-- 한국어 키워드 검색 (pg_trgm — 언어 무관, 부분 문자열 검색 지원)
create index if not exists trends_keyword_trgm_idx
  on trends using gin (keyword gin_trgm_ops);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Public read; service role can write (cron job uses service role key)

alter table trends enable row level security;

-- Allow anyone to read trends
create policy "Public read"
  on trends for select
  using (true);

-- Only service role (authenticated via service key) can insert/update/delete
-- (Service role bypasses RLS by default — no additional policy needed)

-- ─── Helper function: increment view count ────────────────────────────────────
create or replace function increment_view_count(trend_id text)
returns void
language sql
security definer
as $$
  update trends
  set view_count = view_count + 1
  where id = trend_id;
$$;

-- ─── Helper function: toggle bookmark ─────────────────────────────────────────
-- Placeholder — implement per-user bookmarks when auth is added
create or replace function increment_bookmark_count(trend_id text)
returns void
language sql
security definer
as $$
  update trends
  set bookmark_count = bookmark_count + 1
  where id = trend_id;
$$;
