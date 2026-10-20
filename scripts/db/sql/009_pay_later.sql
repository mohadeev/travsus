-- Book now, pay later: pay a €20 deposit now, the rest is charged on the tour day.
-- paymentPlan: 'full' (pay everything now) or 'deposit'.
-- After the deposit the booking is 'deposit_paid'; on the start day a daily job
-- charges balanceAmount to the saved card (stripePaymentMethodId) and the
-- booking becomes 'paid', or 'balance_failed' if the card is refused.
alter table bookings add column if not exists "paymentPlan" text not null default 'full';
alter table bookings add column if not exists "depositAmount" numeric;
alter table bookings add column if not exists "balanceAmount" numeric;
alter table bookings add column if not exists "balanceDueAt" timestamptz;
alter table bookings add column if not exists "stripePaymentMethodId" text;
alter table bookings add column if not exists "balancePaymentIntentId" text;
alter table bookings add column if not exists "balanceAttempts" integer not null default 0;

-- The daily job looks for deposits whose balance is due
create index if not exists bookings_balance_due_idx on bookings ("balanceDueAt") where "bookingState" = 'deposit_paid';
