# My Meetings

Responsive meeting-notes application for desktop and mobile with Microsoft Outlook / Microsoft 365 sign-in, Microsoft Graph calendar sync, PostgreSQL persistence, and AI summarization.

## Required environment variables
- AUTH_SECRET
- AUTH_MICROSOFT_ENTRA_ID_ID
- AUTH_MICROSOFT_ENTRA_ID_SECRET
- AUTH_MICROSOFT_ENTRA_ID_ISSUER
- OPENAI_API_KEY
- OPENAI_MODEL
- DATABASE_URL

## Database
Run `npx prisma generate` and `npx prisma db push` after configuring DATABASE_URL.

## Build
The project pins Prisma 6.19.0 and runs `prisma generate` before `next build` to ensure PrismaClient is generated in Vercel builds.
