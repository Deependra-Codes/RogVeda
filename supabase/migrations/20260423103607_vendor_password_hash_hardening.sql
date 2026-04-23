alter table public.vendors
add column if not exists password_hash text;

update public.vendors
set password_hash = 'scrypt$abf3e45870dfae49433a0ac7b4aeac53$4cdc21f7c9deb7adf4983371b25d458440e74964f8b6c84f7ea0aaf1fa132574895ba6aec62a9ebf9f25baf44bacad530744de639533e3cf546d873900a5a337'
where username = 'apollo'
  and password_hash is null;

do $$
begin
  if exists (
    select 1
    from public.vendors
    where password_hash is null
  ) then
    raise exception 'vendors.password_hash must be backfilled before this migration can complete';
  end if;
end
$$;

alter table public.vendors
alter column password_hash set not null;

alter table public.vendors
drop column if exists password;
