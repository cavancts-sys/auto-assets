# Auto Assets — GitHub / Vercel Deployment

A full-stack car dealership website. React + Vite frontend, Express API, PostgreSQL database.

---

## Deploy to Vercel (recommended)

### Step 1 — Get a free PostgreSQL database
Sign up at **[neon.tech](https://neon.tech)** (free tier, no credit card needed).
Create a project, choose a region close to you, and copy the connection string — it looks like:
```
postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 2 — Push to GitHub
Upload the contents of this folder to a new GitHub repo. You can do this:
- On GitHub.com → New repository → upload files directly, **or**
- Using git on your computer:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/auto-assets.git
  git push -u origin main
  ```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
2. Vercel will auto-detect the settings from `vercel.json` — don't change anything
3. Before clicking Deploy, go to **Environment Variables** and add:
   - `DATABASE_URL` → paste your full Neon connection string (including `?sslmode=require`)
   - `ADMIN_TOKEN` → your admin password (default: `autoassets2024`)
4. Click **Deploy** — it takes about 1 minute

### Step 4 — Custom Domain
In Vercel → your project → **Settings → Domains** → type your domain name.
Vercel shows you the DNS records to add at your domain registrar (Afrihost, Hetzner, etc.).

---

## Admin Panel

The admin panel is hidden — there's no link to it anywhere on the site.
To access it, type `/admin` at the end of your site URL in the browser:
```
https://yourdomain.com/admin
```
Log in with the password set in `ADMIN_TOKEN` (default: `autoassets2024`).

From the admin panel you can:
- Add new cars with photos, specs and pricing
- Edit or delete existing cars
- Toggle cars between available and sold
- Reorder the inventory display

All changes save instantly to the database and are visible to all visitors.

---

## Run Locally (for development)

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Open .env and paste your DATABASE_URL from Neon

# 3. Start the API server (terminal 1)
npm run start        # API runs on http://localhost:3000

# 4. Start the frontend dev server (terminal 2)
npm run dev          # Frontend runs on http://localhost:5173
# API calls are automatically proxied to :3000
```

---

## Project Structure

```
├── api/
│   ├── index.js      ← Express API (served as Vercel serverless function)
│   └── server.js     ← Local dev server entry point
├── src/
│   ├── components/   ← UI components
│   ├── hooks/        ← use-cars, use-inventory (API-connected)
│   ├── lib/          ← data types, utilities
│   └── pages/        ← Home, Garage, Car Detail, Contact, Admin
├── public/           ← Static assets (images, logo, favicon)
├── index.html
├── vite.config.ts
├── vercel.json       ← Routes /api/* to function, everything else to SPA
└── .env.example      ← Copy to .env and fill in your values
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string from Neon/Supabase |
| `ADMIN_TOKEN` | No | `autoassets2024` | Admin panel password — change this! |
| `PORT` | No | `3000` | Local API server port only |
