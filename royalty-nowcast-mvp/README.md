# Royalty Nowcast MVP

Stack: Next.js + TypeScript + Supabase (DB, Auth, Storage) + Supabase Edge Functions (cron)

## Quickstart

1. Copy envs:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in Supabase project URL and anon key in `.env.local`.
3. Initialize DB schema (using Supabase SQL editor or CLI):
   - Apply `supabase/migrations/0001_init.sql`.
4. Create storage bucket:
   - The migration includes `storage.create_bucket('imports', false)` (private).
5. Run the app:
   ```bash
   npm install
   npm run dev
   ```

## Edge Functions (cron)
Functions under `supabase/functions/*`:
- `yt_pull_daily` – fetch last 14 days YouTube daily views per country and upsert into `plays`.
- `update_eps` – recompute `eps_estimates` from `earnings_reports`.
- `forecast_week` – compute weekly gross per ledger and write to `cashflow_expected` with per-source lag.
- `parse_statement` – parse uploaded CSV/PDF in `imports` to normalized `earnings_reports` rows.

Schedule (UTC):
- yt_pull_daily: 05:00 daily
- update_eps: Mondays 04:30
- forecast_week: Mondays 04:45

Configure schedules in the Supabase dashboard or `supabase/config.toml`.

## Auth & RLS
- Users belong to artist workspaces via `artist_memberships(user_id, artist_id, role)`.
- RLS policies restrict access to rows where the user is a member of the related `artist`.
- OAuth refresh tokens are stored encrypted in `oauth_tokens` and not exposed via RLS.

## CSV Templates
Downloadable under `public/csv-templates/`:
- Recordings.csv
- Works.csv
- ISRC_ISWC_Map.csv
- MasterDeals.csv
- PublishingSplits.csv
- Statement_Normalized.csv

## Env Vars
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET (optional)
- YT_SCOPES
- BASE_CURRENCY=SEK
- SUPABASE_SERVICE_ROLE_KEY (edge functions)
- SUPABASE_OAUTH_ENC_KEY (DB encryption via `pgcrypto`)