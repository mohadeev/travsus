-- Affiliate program: one row per "request access" from /affiliates.
-- The owner accepts or declines it in /admin/affiliates and can give a
-- custom commission; rate null = the standard tiers shown on the page
-- (src/app/[locale]/affiliates/tiers.ts).
-- Only the server (secret key) can read or write: RLS on, no policies.
-- Undo: drop table affiliates;

create table if not exists public.affiliates (
	id text primary key default gen_random_uuid()::text,
	email text not null unique,
	website text,                             -- website / channel they gave
	locale text,
	status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
	rate numeric(5, 2) check (rate is null or (rate >= 0 and rate <= 100)), -- custom %, null = tiers
	note text,                                -- private note for the owner
	created_at timestamptz not null default now(),
	decided_at timestamptz
);

create index if not exists affiliates_status_created on public.affiliates (status, created_at desc);

alter table public.affiliates enable row level security;

-- Requests made before this table existed were only tagged in the newsletter list
insert into public.affiliates (email, created_at)
select lower(email), coalesce("createdAt"::timestamptz, now())
from public.newsletter
where 'affiliate' = any(types)
on conflict (email) do nothing;
