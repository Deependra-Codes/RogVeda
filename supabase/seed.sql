truncate table
  public.booking_tasks,
  public.wallet_transactions,
  public.bookings,
  public.pricing,
  public.doctors,
  public.hospitals,
  public.patients,
  public.vendors
restart identity cascade;

insert into public.vendors (username, password, display_name)
values ('apollo', 'apollo123', 'Apollo International Desk');

insert into public.hospitals (
  vendor_id,
  name,
  city,
  region_label,
  procedure_name,
  summary,
  image_token,
  trust_signal_one,
  trust_signal_two,
  trust_signal_three
)
select
  vendors.id,
  hospitals.name,
  hospitals.city,
  hospitals.region_label,
  'Total Knee Replacement',
  hospitals.summary,
  hospitals.image_token,
  hospitals.trust_signal_one,
  hospitals.trust_signal_two,
  hospitals.trust_signal_three
from public.vendors
cross join (
  values
    (
      'Apollo Spectra',
      'Delhi',
      'South Delhi',
      'Dedicated international patient coordinator before arrival',
      'apollo-spectra',
      'Transparent package estimate shared before booking',
      'Visa invite and airport pickup support available',
      'English-speaking care team and fast case review'
    ),
    (
      'Max Saket',
      'Delhi',
      'Saket, Delhi',
      'Higher-capacity center with coordinated stay planning',
      'max-saket',
      'Transparent package estimate shared before booking',
      'Hotel and caregiver stay support around the hospital',
      'International case desk reviews records within 24 hours'
    ),
    (
      'Fortis Gurgaon',
      'Gurgaon',
      'Delhi NCR',
      'Delhi NCR option for patients comparing nearby partner centers',
      'fortis-gurgaon',
      'Transparent package estimate shared before booking',
      'Airport pickup and recovery stay guidance available',
      'Senior surgeon-led review for complex knee replacement cases'
    )
) as hospitals(
  name,
  city,
  region_label,
  summary,
  image_token,
  trust_signal_one,
  trust_signal_two,
  trust_signal_three
);

insert into public.doctors (hospital_id, name, years_experience)
select hospitals.id, doctors.name, doctors.years_experience
from public.hospitals as hospitals
join (
  values
    ('Apollo Spectra', 'Dr. Ramesh Kumar', 16),
    ('Apollo Spectra', 'Dr. Priya Sharma', 12),
    ('Max Saket', 'Dr. Vikram Singh', 18),
    ('Max Saket', 'Dr. Anita Desai', 15),
    ('Max Saket', 'Dr. Mohit Verma', 10),
    ('Fortis Gurgaon', 'Dr. Sunil Mehta', 20)
) as doctors(hospital_name, name, years_experience) on doctors.hospital_name = hospitals.name;

insert into public.pricing (hospital_id, doctor_id, room_type, amount_usd_cents)
select hospitals.id, doctors.id, pricing.room_type::public.room_type, pricing.amount_usd_cents
from public.hospitals as hospitals
join public.doctors as doctors on doctors.hospital_id = hospitals.id
join (
  values
    ('Apollo Spectra', 'Dr. Ramesh Kumar', 'General Ward', 320000),
    ('Apollo Spectra', 'Dr. Priya Sharma', 'General Ward', 300000),
    ('Apollo Spectra', 'Dr. Ramesh Kumar', 'Semi-Private', 380000),
    ('Apollo Spectra', 'Dr. Priya Sharma', 'Semi-Private', 360000),
    ('Apollo Spectra', 'Dr. Ramesh Kumar', 'Private', 450000),
    ('Apollo Spectra', 'Dr. Priya Sharma', 'Private', 420000),
    ('Max Saket', 'Dr. Vikram Singh', 'General Ward', 350000),
    ('Max Saket', 'Dr. Anita Desai', 'General Ward', 340000),
    ('Max Saket', 'Dr. Mohit Verma', 'General Ward', 310000),
    ('Max Saket', 'Dr. Vikram Singh', 'Semi-Private', 420000),
    ('Max Saket', 'Dr. Anita Desai', 'Semi-Private', 400000),
    ('Max Saket', 'Dr. Mohit Verma', 'Semi-Private', 370000),
    ('Max Saket', 'Dr. Vikram Singh', 'Private', 500000),
    ('Max Saket', 'Dr. Anita Desai', 'Private', 480000),
    ('Max Saket', 'Dr. Mohit Verma', 'Private', 440000),
    ('Max Saket', 'Dr. Vikram Singh', 'Suite', 650000),
    ('Max Saket', 'Dr. Anita Desai', 'Suite', 620000),
    ('Max Saket', 'Dr. Mohit Verma', 'Suite', 580000),
    ('Fortis Gurgaon', 'Dr. Sunil Mehta', 'Semi-Private', 390000),
    ('Fortis Gurgaon', 'Dr. Sunil Mehta', 'Private', 460000)
) as pricing(hospital_name, doctor_name, room_type, amount_usd_cents)
  on pricing.hospital_name = hospitals.name
 and pricing.doctor_name = doctors.name;

insert into public.patients (full_name, email, wallet_balance_usd_cents)
values ('Amina Okafor', 'amina@example.com', 0);
