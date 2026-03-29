# Auto Assets — GitHub / Vercel Deployment

A full-stack car dealership website. React + Vite frontend, Express API, PostgreSQL database.

---

## Deploy to Vercel (recommended)

### Step 1 — Get a free PostgreSQL database
Sign up at **[neon.tech](https://neon.tech)** (free tier, no credit card).
Create a project and copy the connection string — it looks like:
```
postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/auto-assets.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
2. Vercel auto-detects everything from `vercel.json`
3. Go to **Settings → Environment Variables** and add:
   - `DATABASE_URL` → paste your Neon connection string
   - `ADMIN_TOKEN` → your admin password (default: `autoassets2024`)
4. Click **Deploy**

### Step 4 — Custom Domain
In Vercel → **Settings → Domains** → add your domain and follow the DNS instructions.

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 3. Start the API server (terminal 1)
npm run start        # runs on localhost:3000

# 4. Start the frontend dev server (terminal 2)
npm run dev          # runs on localhost:5173
# API calls are proxied to :3000 automatically
```

---

## Admin Panel

Visit `/admin` on your site and log in with the password set in `ADMIN_TOKEN`.

- Add, edit, delete cars
- Toggle available / sold
- Reorder inventory
- All changes are saved to the database and visible to everyone immediately

---

## Project Structure

```
├── api/
│   ├── index.js      ← Express API (Vercel serverless function)
│   └── server.js     ← Local dev server entry point
├── src/
│   ├── components/   ← UI components
│   ├── hooks/        ← use-cars, use-inventory (API-connected)
│   ├── lib/          ← data types, utilities
│   └── pages/        ← Home, Garage, Car Detail, Contact, Admin
├── public/           ← Static assets (images, logo, favicon)
├── index.html
├── vite.config.ts
├── vercel.json       ← Vercel deployment config
└── .env.example
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | *required* | PostgreSQL connection string |
| `ADMIN_TOKEN` | `autoassets2024` | Admin panel password — change this! |
| `PORT` | `3000` | Local API server port |
