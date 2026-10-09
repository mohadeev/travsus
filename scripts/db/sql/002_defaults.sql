-- Database-side defaults that Prisma used to fill in on the client.

-- 1. Timestamps: store with time zone (existing values were written as UTC by Prisma)
do $$
declare r record;
begin
	for r in
		select table_name, column_name from information_schema.columns
		where table_schema = 'public' and data_type = 'timestamp without time zone'
	loop
		execute format(
			'alter table public.%I alter column %I type timestamptz using %I at time zone ''UTC''',
			r.table_name, r.column_name, r.column_name
		);
	end loop;
end $$;

-- 2. ids: 24-char hex, same format as the existing MongoDB ObjectIds
create or replace function public.new_object_id() returns text
language sql volatile as $$ select encode(extensions.gen_random_bytes(12), 'hex') $$;

do $$
declare t text;
begin
	for t in select table_name from information_schema.columns
		where table_schema = 'public' and column_name = 'id' and data_type = 'text'
	loop
		execute format('alter table public.%I alter column id set default public.new_object_id()', t);
	end loop;
end $$;

-- 3. updatedAt / lastUpdated: default now() and auto-refresh on update
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
	if to_jsonb(new) ? 'updatedAt' then new."updatedAt" := now(); end if;
	if to_jsonb(new) ? 'lastUpdated' then new."lastUpdated" := now(); end if;
	return new;
end $$;

do $$
declare r record;
begin
	for r in select table_name, column_name from information_schema.columns
		where table_schema = 'public' and column_name in ('updatedAt', 'lastUpdated')
	loop
		execute format('alter table public.%I alter column %I set default now()', r.table_name, r.column_name);
		execute format('drop trigger if exists set_updated_at on public.%I', r.table_name);
		execute format(
			'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
			r.table_name
		);
	end loop;
end $$;

-- 4. Lists default to empty (Prisma/Mongo filled these with [])
do $$
declare r record;
begin
	for r in select table_name, column_name from information_schema.columns
		where table_schema = 'public' and data_type = 'ARRAY' and column_default is null
	loop
		execute format('alter table public.%I alter column %I set default ''{}''', r.table_name, r.column_name);
	end loop;
end $$;

alter table public.tours
	alter column slugs set default '[]', alter column images set default '[]',
	alter column people set default '[]', alter column services set default '[]',
	alter column places set default '[]', alter column highlights set default '[]',
	alter column days set default '[]', alter column paths set default '[]',
	alter column tags set default '[]', alter column keyphrase set default '[]',
	alter column faq set default '[]', alter column "pricingTiers" set default '[]',
	alter column accommodations set default '[]', alter column translations set default '[]';
alter table public."Post" alter column translations set default '[]';
alter table public.newsletter alter column tokens set default '[]';
