## Introduction
    This project is being created in order to document every Palestinian life lost in Gaza, with dignity, accuracy, and transparency. Our work ensures that these lives are not reduced to mere statistics but are remembered as individuals with names, families, and stories.

## Architecture
- Vercel
- Nextjs
- Prisma
- Shadcn
- Nextjs native i18n

## Prerequisites

- Node 18+
- Prisma database with credentials in .env

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