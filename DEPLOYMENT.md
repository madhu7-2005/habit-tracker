# Render.com Deployment Guide

## Quick Deploy (5 minutes)

### 1. Sign Up & Connect GitHub
- Go to https://render.com
- Click **Sign up** → **Continue with GitHub**
- Authorize Render to access your repositories

### 2. Deploy Backend Server

1. Click **New +** → **Web Service**
2. Select `habit-tracker` repository → **Connect**
3. Fill the form:
   - **Name:** `habit-tracker-server`
   - **Environment:** Node
   - **Region:** (closest to you)
   - **Branch:** main
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free
4. Click **Create Web Service**
5. Wait for deployment (5-10 min)

### 3. Create PostgreSQL Database

1. Click **New +** → **PostgreSQL**
2. Name: `habit-tracker-db`
3. Plan: Free
4. Click **Create Database**
5. **Copy the connection string** (looks like: `postgres://user:pass@host:port/db`)

### 4. Connect Database to Server

1. Go to `habit-tracker-server` → **Environment**
2. Add variable:
   - **Key:** `DATABASE_URL`
   - **Value:** (Paste the connection string from step 3)
3. Click **Save Changes**
4. Server auto-redeploys

### 5. Run Database Migration

1. Go to `habit-tracker-server` → **Shell** tab
2. Paste and run:
   ```bash
   node server/migrate.js
   ```
3. Should see: `Migration completed successfully`

### 6. Deploy Frontend

**Option A: Same Service (Easier)**
- Already configured in render.yaml
- Runs on same URL as backend

**Option B: Separate Static Site**
1. New Static Site
2. Connect `habit-tracker` repo
3. Build Command: `cd client && npm run build`
4. Publish Directory: `client/dist`
5. Set env var: `VITE_API_URL=https://habit-tracker-server.onrender.com`

---

## Verify Deployment

Once both are running:

1. **Check Backend:** `https://habit-tracker-server.onrender.com/` → should show `{"ok":true}`
2. **Check API:** `https://habit-tracker-server.onrender.com/api/habits` → should return habits array
3. **Access App:** Click the Render dashboard link to view frontend

---

## Troubleshooting

**Service won't deploy?**
- Check **Logs** tab for error messages
- Ensure `DATABASE_URL` is set correctly
- Free tier needs 30+ seconds to start first time

**API returns 500 error?**
- Database migration may not have run
- Run migration again in Shell tab
- Check DATABASE_URL environment variable

**CORS errors in frontend?**
- Ensure `VITE_API_URL` points to backend service
- Should be: `https://habit-tracker-server.onrender.com`

**Database connection refused?**
- PostgreSQL takes ~1 minute to initialize
- Wait, then run migration again
- Check connection string matches DATABASE_URL

---

## Free Tier Limits

- **Inactivity sleep:** Service sleeps after 15 min idle (auto-wakes)
- **Database:** 256 MB free (enough for ~10k habits)
- **Bandwidth:** Generous free tier
- **No credit card needed** to start

---

## Next Steps

After deployment:
1. Share the app URL with users
2. Users can create accounts and add habits
3. All data persists in PostgreSQL
4. No local database needed

---

## Update & Redeploy

To push changes:
```bash
git commit -am "Update message"
git push origin main
```

Render auto-deploys within 1-2 minutes!

---

## Support

- Render docs: https://render.com/docs
- Check service logs for error details
- Verify DATABASE_URL in Environment tab
