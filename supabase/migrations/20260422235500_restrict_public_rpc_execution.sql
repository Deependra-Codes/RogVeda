revoke all
on function public.create_booking_transaction(uuid, uuid, public.room_type, text, text)
from public, anon, authenticated;

revoke all
on function public.complete_booking_task(uuid, uuid)
from public, anon, authenticated;

grant execute
on function public.create_booking_transaction(uuid, uuid, public.room_type, text, text)
to service_role;

grant execute
on function public.complete_booking_task(uuid, uuid)
to service_role;
