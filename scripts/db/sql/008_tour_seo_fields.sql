-- Google title and description for a tour, separate from its name and subtitle.
-- The English values are also kept in the en-US translation, which the page reads.
alter table tours add column if not exists "seoTitle" text;
alter table tours add column if not exists "metaDescription" text;
