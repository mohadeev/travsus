-- Affiliate tracking: each accepted affiliate has a code (?ref=CODE on any
-- link). A visit with a valid code is a click and leaves a 60-day cookie;
-- a booking made with that cookie is a referral. Earnings are computed from
-- the referred bookings (src/lib/affiliates.ts); payouts are recorded by the
-- owner in /admin/affiliates.
-- Only the server (secret key) can read or write: RLS on, no policies.
-- Undo: drop table affiliate_payouts, affiliate_referrals, affiliate_clicks;
--       alter table affiliates drop column code;

alter table public.affiliates add column if not exists code text unique;

create table if not exists public.affiliate_clicks (
	id bigint generated always as identity primary key,
	affiliate_id text not null references public.affiliates(id) on delete cascade,
	created_at timestamptz not null default now(),
	path text,                                -- page the link pointed to
	country text
);

create table if not exists public.affiliate_referrals (
	booking_id text primary key,              -- bookings.id (one affiliate per booking)
	affiliate_id text not null references public.affiliates(id) on delete cascade,
	created_at timestamptz not null default now()
);

create table if not exists public.affiliate_payouts (
	id text primary key default gen_random_uuid()::text,
	affiliate_id text not null references public.affiliates(id) on delete cascade,
	amount numeric(10, 2) not null check (amount > 0), -- euros
	paid_at timestamptz not null default now(),
	note text                                 -- e.g. PayPal reference
);

create index if not exists affiliate_clicks_affiliate on public.affiliate_clicks (affiliate_id, created_at desc);
create index if not exists affiliate_referrals_affiliate on public.affiliate_referrals (affiliate_id);
create index if not exists affiliate_payouts_affiliate on public.affiliate_payouts (affiliate_id, paid_at desc);

alter table public.affiliate_clicks enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_payouts enable row level security;
