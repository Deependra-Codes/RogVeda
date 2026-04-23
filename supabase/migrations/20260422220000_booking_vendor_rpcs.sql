create or replace function public.create_booking_transaction(
  input_hospital_id uuid,
  input_doctor_id uuid,
  input_room_type public.room_type,
  input_patient_name text,
  input_patient_email text
)
returns table (
  booking_id uuid,
  booking_status public.booking_status,
  wallet_balance_usd_cents integer,
  amount_usd_cents integer,
  patient_id uuid,
  task_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_pricing record;
  resolved_patient public.patients%rowtype;
  inserted_booking record;
  inserted_task record;
  next_balance integer;
begin
  if nullif(trim(input_patient_name), '') is null then
    raise exception using message = 'Patient name is required', errcode = 'P0001';
  end if;

  if nullif(trim(input_patient_email), '') is null then
    raise exception using message = 'Patient email is required', errcode = 'P0001';
  end if;

  select
    pricing.amount_usd_cents,
    hospitals.vendor_id,
    hospitals.procedure_name
  into matched_pricing
  from public.pricing as pricing
  inner join public.doctors as doctors
    on doctors.id = pricing.doctor_id
  inner join public.hospitals as hospitals
    on hospitals.id = pricing.hospital_id
  where pricing.hospital_id = input_hospital_id
    and pricing.doctor_id = input_doctor_id
    and pricing.room_type = input_room_type
    and doctors.hospital_id = input_hospital_id;

  if not found then
    raise exception using
      message = 'Invalid hospital, doctor, and room combination',
      errcode = 'P0001';
  end if;

  select *
  into resolved_patient
  from public.patients
  where email = lower(trim(input_patient_email));

  if not found then
    insert into public.patients (
      full_name,
      email,
      wallet_balance_usd_cents
    )
    values (
      trim(input_patient_name),
      lower(trim(input_patient_email)),
      0
    )
    returning *
    into resolved_patient;
  end if;

  next_balance := resolved_patient.wallet_balance_usd_cents - matched_pricing.amount_usd_cents;

  update public.patients
  set
    full_name = trim(input_patient_name),
    wallet_balance_usd_cents = next_balance
  where id = resolved_patient.id
  returning *
  into resolved_patient;

  insert into public.bookings (
    patient_id,
    vendor_id,
    hospital_id,
    doctor_id,
    procedure_name,
    room_type,
    amount_usd_cents,
    status
  )
  values (
    resolved_patient.id,
    matched_pricing.vendor_id,
    input_hospital_id,
    input_doctor_id,
    matched_pricing.procedure_name,
    input_room_type,
    matched_pricing.amount_usd_cents,
    'Confirmed'
  )
  returning id, status
  into inserted_booking;

  insert into public.wallet_transactions (
    patient_id,
    booking_id,
    kind,
    amount_usd_cents,
    balance_after_usd_cents,
    note
  )
  values (
    resolved_patient.id,
    inserted_booking.id,
    'booking_debit',
    -matched_pricing.amount_usd_cents,
    next_balance,
    'Total Knee Replacement booking debit'
  );

  insert into public.booking_tasks (
    booking_id,
    vendor_id,
    title,
    status
  )
  values (
    inserted_booking.id,
    matched_pricing.vendor_id,
    'Visa Invite Letter Sent',
    'Pending'
  )
  returning id, status
  into inserted_task;

  booking_id := inserted_booking.id;
  booking_status := inserted_booking.status;
  wallet_balance_usd_cents := next_balance;
  amount_usd_cents := matched_pricing.amount_usd_cents;
  patient_id := resolved_patient.id;
  task_id := inserted_task.id;

  return next;
end;
$$;

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
  returning id, booking_id, status
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
