-- First-party analytics: one row per visit (with its live position) and the
-- events inside it. No IP addresses are stored. Visits are anonymous unless
-- the visitor accepted measurement cookies (then visitor_id / user_id are set).
-- Only the server (secret key) can read or write: RLS on, no policies.
-- Undo: drop table analytics_events; drop table analytics_sessions;

create table if not exists public.analytics_sessions (
	id text primary key,                      -- random id made by the browser, per visit
	visitor_id text,                          -- same person across visits (consent only)
	user_id text,                             -- TRAVSUS account (consent only)
	consent boolean not null default false,
	started_at timestamptz not null default now(),
	last_seen_at timestamptz not null default now(),
	country text,
	region text,
	city text,
	locale text,
	referrer text,
	source text,                              -- google, instagram, direct, …
	medium text,                              -- organic, social, referral, cpc, …
	campaign text,
	landing_path text,
	device text,                              -- mobile, tablet, desktop
	browser text,
	os text,
	screen text,
	current_path text,                        -- live: page open right now
	current_title text,
	current_scroll smallint,                  -- live: % of the page scrolled
	pageviews integer not null default 0,
	errors integer not null default 0
);

create table if not exists public.analytics_events (
	id bigint generated always as identity primary key,
	session_id text not null references public.analytics_sessions(id) on delete cascade,
	created_at timestamptz not null default now(),
	type text not null,                       -- pageview, leave, click, error, search, …
	path text,
	title text,
	duration_ms integer,                      -- leave: time spent on the page
	scroll smallint,                          -- leave: deepest scroll on the page, %
	data jsonb
);

create index if not exists analytics_sessions_last_seen on public.analytics_sessions (last_seen_at desc);
create index if not exists analytics_sessions_started on public.analytics_sessions (started_at desc);
create index if not exists analytics_sessions_user on public.analytics_sessions (user_id) where user_id is not null;
create index if not exists analytics_events_session on public.analytics_events (session_id, created_at);
create index if not exists analytics_events_type_time on public.analytics_events (type, created_at desc);
create index if not exists analytics_events_time on public.analytics_events (created_at desc);

alter table public.analytics_sessions enable row level security;
alter table public.analytics_events enable row level security;
