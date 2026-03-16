-- Optional starter records for CampLog after creating a user manually.
-- Replace the UUID below with a real auth.users/profile id before running.

-- example:
-- update public.profiles set display_name = 'Trail Demo' where id = '00000000-0000-0000-0000-000000000000';

insert into public.gear_items (
  id,
  user_id,
  name,
  category,
  brand,
  memo
)
values
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Alpha TC Tent',
    'Tent',
    'Nord Hearth',
    'Main shelter for two-night trips.'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Compact Fire Pit',
    'Fire',
    'Ember Fold',
    'Used for steak and coffee boil.'
  );
