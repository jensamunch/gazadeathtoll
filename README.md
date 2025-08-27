This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## What is this?

An example app that lets admins upload a CSV which is stored in Postgres via Prisma, and displays the data publicly using AG Grid. Authentication is powered by Clerk.

## Prerequisites

- Node 18+
- Postgres database
- Clerk account (for auth)

## Environment

See `ENVIRONMENT.md` for required environment variables. Create a `.env.local` with your values.

## Setup

1. Install deps:

```bash
npm install
```

2. Generate Prisma client and run migrations (model is simple and migration-less by default):

```bash
npx prisma generate
# If you want to create the table automatically via SQL migration, you can also run:
# npx prisma db push
```

3. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Admin

- Add your Clerk user id(s) to `ADMIN_CLERK_IDS` in `.env.local`.
- Visit `/admin` to upload a CSV. Upload replaces the entire dataset.

## API

- `GET /api/rows` returns stored rows ordered by `createdAt desc`.
- `POST /api/upload` accepts a `multipart/form-data` upload with `file` (.csv). Protected by Clerk and `ADMIN_CLERK_IDS`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
