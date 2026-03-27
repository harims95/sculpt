# Deployment Guide

## Overview
- **Chisel** (frontend) → Vercel
- **Workshop** (proxy) → Railway
- **Database** → Neon (free PostgreSQL)
- **Auth** → Clerk

---

## Step 1 — Database (Neon)

1. Go to https://neon.tech and create a free account
2. Create a new project named `sculpt`
3. Copy the connection string — it looks like:
   `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
4. Run migrations:
   ```bash
   cd packages/db
   cp .env.example .env
   # Paste DATABASE_URL into .env
   npx prisma db push
   ```

---

## Step 2 — Generate Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Save this — you'll need it in both Vercel and Railway.

---

## Step 3 — Clerk Setup

1. Go to https://clerk.com and create a free account
2. Create a new application named `Sculpt`
3. In **API Keys**, copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. In **Webhooks**, create a new endpoint:
   - URL: `https://your-app.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`
   - Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET`

---

## Step 4 — Deploy Workshop to Railway

1. Go to https://railway.app and create a free account
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `harims95/sculpt`
4. Set **Root Directory** to `/` (uses the Dockerfile)
5. Add environment variables:
   ```
   DATABASE_URL=<from Neon>
   ENCRYPTION_KEY=<from Step 2>
   ALLOWED_ORIGINS=https://your-app.vercel.app
   PORT=3001
   ```
6. Deploy — Railway gives you a URL like `https://sculpt-workshop.up.railway.app`

---

## Step 5 — Deploy Chisel to Vercel

1. Go to https://vercel.com and create a free account
2. Click **Add New Project** → Import `harims95/sculpt`
3. Vercel auto-detects the `vercel.json` config
4. Add environment variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   CLERK_WEBHOOK_SECRET=whsec_...
   DATABASE_URL=<from Neon>
   ENCRYPTION_KEY=<from Step 2>
   NEXT_PUBLIC_WORKSHOP_URL=https://sculpt-workshop.up.railway.app
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```
5. Deploy — Vercel gives you a URL like `https://sculpt.vercel.app`

---

## Step 6 — Update ALLOWED_ORIGINS in Railway

Go back to Railway and update:
```
ALLOWED_ORIGINS=https://sculpt.vercel.app
```

---

## Step 7 — Update Clerk Webhook URL

In Clerk dashboard, update the webhook endpoint URL to your real Vercel URL:
`https://sculpt.vercel.app/api/webhooks/clerk`

---

## Done

Your app is live at `https://sculpt.vercel.app`

- Landing: `/`
- Sign up: `/sign-up`
- Sculpt: `/sculpt`
- Dashboard: `/dashboard`

---

## Local Development

```bash
# Copy and fill in env files
cp packages/chisel/.env.local.example packages/chisel/.env.local
cp packages/workshop/.env.example packages/workshop/.env

# Start chisel (port 3000)
npm run dev

# Start workshop (port 3001) — separate terminal
npm run workshop:dev

# Run database migrations
npm run db:push
```
