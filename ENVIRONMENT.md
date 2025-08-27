# Environment configuration

Create a `.env.local` in the project root with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
CLERK_SECRET_KEY="sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Admin users (comma-separated Clerk user IDs)
ADMIN_CLERK_IDS="user_123,user_456"
```

Notes:
- Obtain Clerk keys from your Clerk dashboard. Use test keys locally.
- `ADMIN_CLERK_IDS` controls who can access `/admin` and `/api/upload`.
- Ensure your Postgres is reachable by `DATABASE_URL` before running Prisma.
