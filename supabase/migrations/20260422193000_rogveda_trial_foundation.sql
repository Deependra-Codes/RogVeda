create extension if not exists "pgcrypto";

create type public.room_type as enum (
  'General Ward',
  'Semi-Private',
  'Private',
  'Suite'
);

create type public.booking_status as enum (
  'Confirmed',
  'In Progress',
  'Completed'
);

create type public.booking_task_status as enum (
  'Pending',
  'Complete'
);

create type public.wallet_transaction_kind as enum (
  'booking_debit',
  'manual_credit'
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  display_name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  name text not null unique,
  city text not null,
  region_label text not null,
  procedure_name text not null,
  summary text not null,
  image_token text not null,
  trust_signal_one text not null,
  trust_signal_two text not null,
  trust_signal_three text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  name text not null,
  years_experience integer not null check (years_experience >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (hospital_id, name)
);

create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  room_type public.room_type not null,
  amount_usd_cents integer not null check (amount_usd_cents > 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (hospital_id, doctor_id, room_type)
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  wallet_balance_usd_cents integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete restrict,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  hospital_id uuid not null references public.hospitals(id) on delete restrict,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  procedure_name text not null,
  room_type public.room_type not null,
  amount_usd_cents integer not null check (amount_usd_cents > 0),
  status public.booking_status not null default 'Confirmed',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  kind public.wallet_transaction_kind not null default 'booking_debit',
  amount_usd_cents integer not null,
  balance_after_usd_cents integer not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_tasks (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  title text not null,
  status public.booking_task_status not null default 'Pending',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists hospitals_procedure_name_idx on public.hospitals (procedure_name);
create index if not exists doctors_hospital_id_idx on public.doctors (hospital_id);
create index if not exists pricing_hospital_id_idx on public.pricing (hospital_id);
create index if not exists pricing_doctor_id_idx on public.pricing (doctor_id);
create index if not exists bookings_vendor_id_idx on public.bookings (vendor_id);
create index if not exists bookings_patient_id_idx on public.bookings (patient_id);
create index if not exists booking_tasks_vendor_id_idx on public.booking_tasks (vendor_id);
