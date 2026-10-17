-- Price groups: tours that are versions of the same trip (same itinerary,
-- different titles and texts for different searches) share their prices.
-- Saving the prices of one tour in a group updates all of them.
alter table tours add column if not exists "priceGroupId" text;
create index if not exists tours_price_group_idx on tours ("priceGroupId");
