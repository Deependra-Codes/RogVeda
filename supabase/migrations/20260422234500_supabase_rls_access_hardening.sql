alter table public.vendors enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.pricing enable row level security;
alter table public.patients enable row level security;
alter table public.bookings enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.booking_tasks enable row level security;

revoke all on table public.vendors from anon, authenticated;
revoke all on table public.hospitals from anon, authenticated;
revoke all on table public.doctors from anon, authenticated;
revoke all on table public.pricing from anon, authenticated;
revoke all on table public.patients from anon, authenticated;
revoke all on table public.bookings from anon, authenticated;
revoke all on table public.wallet_transactions from anon, authenticated;
revoke all on table public.booking_tasks from anon, authenticated;

grant select on table public.hospitals to anon, authenticated;
grant select on table public.doctors to anon, authenticated;
grant select on table public.pricing to anon, authenticated;

drop policy if exists "public read hospitals" on public.hospitals;
create policy "public read hospitals"
on public.hospitals
for select
to anon, authenticated
using (true);

drop policy if exists "public read doctors" on public.doctors;
create policy "public read doctors"
on public.doctors
for select
to anon, authenticated
using (true);

drop policy if exists "public read pricing" on public.pricing;
create policy "public read pricing"
on public.pricing
for select
to anon, authenticated
using (true);

revoke all
on function public.create_booking_transaction(uuid, uuid, public.room_type, text, text)
from public;

revoke all
on function public.complete_booking_task(uuid, uuid)
from public;

grant execute
on function public.create_booking_transaction(uuid, uuid, public.room_type, text, text)
to service_role;

grant execute
on function public.complete_booking_task(uuid, uuid)
to service_role;
