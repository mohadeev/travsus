-- Places / geography data (was the separate MongoDB "places" database).
-- Prefixed geo_ to avoid clashing with the main places / translation tables.

create table if not exists public.geo_translatable_contents (
	id text primary key default public.new_object_id(),
	entity text not null,
	"alternativeNames" jsonb not null default '[]',
	code3 text,
	type text
);

create table if not exists public.geo_translated_texts (
	id text primary key default public.new_object_id(),
	"contentId" text not null references public.geo_translatable_contents(id) on delete cascade,
	code3 text,
	language text not null,
	text text not null,
	type text
);
create index if not exists geo_translated_texts_content_idx on public.geo_translated_texts("contentId");
create index if not exists geo_translated_texts_lang_idx on public.geo_translated_texts(language);

create table if not exists public.geo_continents (
	id text primary key default public.new_object_id(),
	code text not null unique,
	"contentId" text not null references public.geo_translatable_contents(id),
	geo jsonb,
	image jsonb,
	translations jsonb not null default '[]',
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);

create table if not exists public.geo_countries (
	id text primary key default public.new_object_id(),
	code text not null unique,
	code3 text not null unique,
	"contentId" text not null references public.geo_translatable_contents(id),
	"continentId" text references public.geo_continents(id),
	geo jsonb not null,
	image jsonb,
	type text,
	translations jsonb not null default '[]',
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);

create table if not exists public.geo_states (
	id text primary key default public.new_object_id(),
	"countryId" text not null references public.geo_countries(id),
	"contentId" text not null references public.geo_translatable_contents(id),
	code text,
	geo jsonb,
	image jsonb,
	type text,
	translations jsonb not null default '[]',
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now(),
	unique ("countryId", code)
);
create index if not exists geo_states_country_idx on public.geo_states("countryId");

create table if not exists public.geo_cities (
	id text primary key default public.new_object_id(),
	"countryId" text not null references public.geo_countries(id),
	"stateId" text references public.geo_states(id),
	"contentId" text not null references public.geo_translatable_contents(id),
	geo jsonb not null,
	image jsonb,
	population integer,
	timezone text,
	code3 text,
	type text,
	translations jsonb not null default '[]',
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);
create index if not exists geo_cities_country_idx on public.geo_cities("countryId");
create index if not exists geo_cities_state_idx on public.geo_cities("stateId");
create index if not exists geo_cities_content_idx on public.geo_cities("contentId");

create table if not exists public.geo_places (
	id text primary key default public.new_object_id(),
	"cityId" text references public.geo_cities(id),
	"stateId" text references public.geo_states(id),
	"countryId" text references public.geo_countries(id),
	"contentId" text not null references public.geo_translatable_contents(id),
	geo jsonb not null,
	image jsonb,
	type text not null,
	category text not null,
	subcategory text,
	tags text[] not null default '{}',
	rating double precision,
	address text,
	website text,
	phone text,
	translations jsonb not null default '[]',
	"createdAt" timestamptz not null default now(),
	"updatedAt" timestamptz not null default now()
);
create index if not exists geo_places_city_idx on public.geo_places("cityId");
create index if not exists geo_places_state_idx on public.geo_places("stateId");
create index if not exists geo_places_country_idx on public.geo_places("countryId");

-- Keep updatedAt fresh + lock down (server uses the secret key)
do $$
declare t text;
begin
	foreach t in array array['geo_continents','geo_countries','geo_states','geo_cities','geo_places'] loop
		execute format('drop trigger if exists set_updated_at on public.%I', t);
		execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
	end loop;
	foreach t in array array['geo_continents','geo_countries','geo_states','geo_cities','geo_places','geo_translatable_contents','geo_translated_texts'] loop
		execute format('alter table public.%I enable row level security', t);
	end loop;
end $$;
