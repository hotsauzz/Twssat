-- Enable extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- =============================
-- Reference entities
-- =============================
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  platform varchar(32) not null,
  platform_id text,
  name text not null,
  youtube_channel_id text,
  created_at timestamptz default now()
);

create table if not exists public.recordings (
  isrc text primary key,
  upc text,
  title text not null,
  artist_id uuid references public.artists(id) on delete cascade,
  release_date date,
  label_entity text,
  created_at timestamptz default now()
);
create index if not exists recordings_artist_id_idx on public.recordings(artist_id);

create table if not exists public.works (
  iswc text primary key,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.isrc_iswc_map (
  isrc text references public.recordings(isrc) on delete cascade,
  iswc text references public.works(iswc) on delete cascade,
  share_pct numeric check (share_pct >= 0 and share_pct <= 100),
  primary key (isrc, iswc)
);

-- =============================
-- Activity and statements
-- =============================
create table if not exists public.plays (
  date date not null,
  platform varchar(32) not null,
  territory char(2) not null,
  isrc text references public.recordings(isrc),
  streams bigint not null check (streams >= 0),
  inserted_at timestamptz default now(),
  primary key(date, platform, territory, isrc)
);
create index if not exists plays_platform_territory_idx on public.plays(platform, territory);

create table if not exists public.earnings_reports (
  id uuid primary key default gen_random_uuid(),
  period daterange not null,
  source varchar(32) not null,
  ledger varchar(16) not null,
  territory char(2) not null,
  id_type varchar(8) not null,
  id_value text not null,
  units bigint,
  gross_sek numeric,
  fees_sek numeric default 0,
  currency text,
  meta jsonb,
  inserted_at timestamptz default now()
);
create index if not exists earnings_reports_id_idx on public.earnings_reports(id_type, id_value);
create index if not exists earnings_reports_source_ledger_idx on public.earnings_reports(source, ledger);

-- =============================
-- Contracts
-- =============================
create table if not exists public.contracts_master (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  aggregator_fee_pct numeric default 0,
  producer_points_pct numeric default 0,
  advances_sek numeric default 0,
  recoup_order_json jsonb default '["advances","costs","royalties"]'::jsonb,
  costs_pool_sek numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.contracts_publishing (
  iswc text primary key references public.works(iswc) on delete cascade,
  writer_shares_json jsonb not null,
  publisher_shares_json jsonb not null,
  admin_fee_pct numeric default 0,
  subpub_json jsonb,
  advances_sek numeric default 0
);

create table if not exists public.contracts_neighbouring (
  isrc text primary key references public.recordings(isrc) on delete cascade,
  role_splits_json jsonb not null
);

-- =============================
-- EPS estimates & cashflow
-- =============================
create table if not exists public.eps_estimates (
  id uuid primary key default gen_random_uuid(),
  platform varchar(32) not null,
  territory char(2) not null,
  ledger varchar(16) not null default 'master',
  eps_sek_per_unit numeric not null,
  valid_from date not null default now()::date,
  unique(platform, territory, ledger, valid_from)
);

create table if not exists public.cashflow_expected (
  id uuid primary key default gen_random_uuid(),
  pay_date date not null,
  source varchar(32) not null,
  ledger varchar(16) not null,
  amount_sek numeric not null,
  ci_low numeric,
  ci_high numeric,
  artist_id uuid references public.artists(id) on delete cascade,
  created_at timestamptz default now()
);
create index if not exists cashflow_expected_artist_paydate_idx on public.cashflow_expected(artist_id, pay_date);

-- Optional: per-party breakdown table
create table if not exists public.cashflow_party (
  id uuid primary key default gen_random_uuid(),
  cashflow_expected_id uuid references public.cashflow_expected(id) on delete cascade,
  party text not null,
  amount_sek numeric not null
);

-- =============================
-- Auth & memberships
-- =============================
create table if not exists public.artist_memberships (
  user_id uuid not null,
  artist_id uuid references public.artists(id) on delete cascade,
  role text default 'member',
  primary key (user_id, artist_id)
);

-- Encrypted OAuth token storage
create schema if not exists secret;
create table if not exists secret.oauth_tokens (
  user_id uuid not null,
  provider text not null,
  refresh_token bytea not null,
  scopes text[] not null,
  inserted_at timestamptz default now(),
  primary key (user_id, provider)
);

-- =============================
-- Storage bucket (imports)
-- =============================
-- Note: Requires supabase.storage
do $$
begin
  perform storage.create_bucket('imports', false);
exception when others then null;
end $$;

-- =============================
-- RLS Policies
-- =============================
alter table public.artists enable row level security;
alter table public.recordings enable row level security;
alter table public.plays enable row level security;
alter table public.earnings_reports enable row level security;
alter table public.cashflow_expected enable row level security;
alter table public.isrc_iswc_map enable row level security;

-- Helper function: check if current auth uid is member of artist
create or replace function public.is_member(artist uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.artist_memberships m
    where m.artist_id = artist and m.user_id = auth.uid()
  );
$$;

-- Artists: a member of an artist can see the artist row
create policy if not exists artists_select on public.artists
for select using (
  exists(
    select 1 from public.artist_memberships m
    where m.artist_id = artists.id and m.user_id = auth.uid()
  )
);

-- Recordings: join to artist
create policy if not exists recordings_select on public.recordings
for select using (
  exists(
    select 1 from public.artist_memberships m
    where m.artist_id = recordings.artist_id and m.user_id = auth.uid()
  )
);

-- Plays: via recording -> artist
create policy if not exists plays_select on public.plays
for select using (
  plays.isrc is null or exists (
    select 1 from public.recordings r
    join public.artist_memberships m on m.artist_id = r.artist_id
    where r.isrc = plays.isrc and m.user_id = auth.uid()
  )
);

-- Earnings reports: by id_type/id_value may map to artist via recording or work
create policy if not exists earnings_reports_select on public.earnings_reports
for select using (
  case when id_type = 'ISRC' then exists (
    select 1 from public.recordings r
    join public.artist_memberships m on m.artist_id = r.artist_id
    where r.isrc = earnings_reports.id_value and m.user_id = auth.uid()
  ) else true end
);

-- Cashflow expected: by artist
create policy if not exists cashflow_expected_select on public.cashflow_expected
for select using (
  exists(
    select 1 from public.artist_memberships m
    where m.artist_id = cashflow_expected.artist_id and m.user_id = auth.uid()
  )
);

-- =============================
-- Minimal functions for import normalization helper
-- =============================
create or replace function public.daterange_make(start_date date, end_date date)
returns daterange language sql immutable as $$
  select daterange(start_date, end_date, '[)');
$$;

-- =============================
-- Audit log
-- =============================
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz default now()
);