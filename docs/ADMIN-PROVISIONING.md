# Admin provisioning

There is no sign-up anywhere in the application. Admins are created by the
owner, by hand, in three steps. Nobody (including an AI agent) promotes an
account to admin without the owner's explicit approval.

Supabase project: `cgwphkmezoaigxgvywpe` (see `docs/DECISIONS.md`, D-018).

## 1. Turn off public sign-ups (once)

Supabase dashboard → Authentication → Sign In / Providers → turn **off**
"Allow new users to sign up".

Why: the app has no sign-up form, but the Supabase Auth API accepts sign-ups
from anyone holding the publishable key, which is public by design. A
signed-up stranger still gets nothing (no profile row means no admin, and RLS
returns zero rows), but there is no reason to let the accounts exist.

## 2. Create the account

Supabase dashboard → Authentication → Users → **Add user** → **Create new
user**. Enter the email and a strong password, and tick "Auto Confirm User".

Copy the new user's **UID**.

## 3. Grant admin

Supabase dashboard → SQL Editor:

```sql
insert into public.profiles (id, full_name)
values ('<the UID from step 2>', '<their name>');
```

`role` defaults to `admin`. The account can now sign in at `/admin/login`.

## Removing an admin

```sql
delete from public.profiles where id = '<UID>';
```

Then delete the user under Authentication → Users. Deleting a user does not
invalidate a token already issued, so for an urgent removal also sign the user
out of all sessions from the same screen first.

## How access is enforced

| Layer                                  | Rule                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/proxy.ts`                         | Refreshes the session cookie on `/admin` routes. Not an access check.                         |
| `(protected)/layout.tsx` → `AdminGate` | No profile row with `role = 'admin'` → redirect to sign-in.                                   |
| `signIn` server action                 | A valid password without a profile row is signed straight back out.                           |
| Postgres RLS                           | `private.is_admin()` gates every admin read and write, so even a bypassed page reads nothing. |

The role lives in `public.profiles`, never in `user_metadata`, because users
can edit their own metadata.
