create or replace function public.complete_booking_task(
  input_task_id uuid,
  input_vendor_id uuid
)
returns table (
  task_id uuid,
  task_status public.booking_task_status,
  booking_id uuid,
  booking_status public.booking_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_task record;
begin
  update public.booking_tasks
  set
    status = 'Complete',
    completed_at = coalesce(completed_at, timezone('utc', now()))
  where id = input_task_id
    and vendor_id = input_vendor_id
  returning
    public.booking_tasks.id,
    public.booking_tasks.booking_id,
    public.booking_tasks.status
  into matched_task;

  if not found then
    raise exception using
      message = 'Task not found for vendor',
      errcode = 'P0001';
  end if;

  update public.bookings
  set status = 'In Progress'
  where id = matched_task.booking_id
  returning status
  into booking_status;

  task_id := matched_task.id;
  task_status := matched_task.status;
  booking_id := matched_task.booking_id;

  return next;
end;
$$;
