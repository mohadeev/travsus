-- Lock down every table: the publishable (anon) key gets no access by default.
-- Server code uses the secret key, which bypasses RLS.
-- Undo for a table: alter table "<name>" disable row level security;

do $$
declare t text;
begin
	for t in select tablename from pg_tables where schemaname = 'public' loop
		execute format('alter table public.%I enable row level security', t);
	end loop;
end $$;

-- Public, read-only tour content (used by middleware tour redirects)
create policy "public read" on public.tours for select using (true);
create policy "public read" on public.reviews for select using (true);
create policy "public read" on public."Address" for select using (true);
create policy "public read" on public.translatable_contents for select using (true);
create policy "public read" on public.translated_texts for select using (true);
