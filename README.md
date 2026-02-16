# Habit Tracker - Full Stack Application

A modern habit tracking application built with Express.js, React, and PostgreSQL. Track daily habits, monitor completion streaks, and build lasting routines.

**Built for daily users** — simple, fast, and intuitive.

---

## Features

✅ **Create & Manage Habits** — Add habits with optional descriptions  
✅ **Track Completions** — Mark habits complete for any date  
✅ **Streak Counting** — Automatic streak calculation and display  
✅ **Real-time Updates** — No page refresh needed  
✅ **Input Validation** — Joi validation on backend, client-side error handling  
✅ **Responsive UI** — Works on desktop and mobile  
✅ **PostgreSQL Persistence** — All data safely stored in database  
✅ **REST API** — Fully documented API endpoints  

---

## Tech Stack

**Frontend:**
- React 18
- Vite (fast dev server)
- Axios (HTTP client)
- CSS (minimal, clean styling)

**Backend:**
- Node.js + Express.js
- PostgreSQL (database)
- Joi (input validation)
- CORS enabled for frontend integration

**Deployment:**
- Docker support (included)
- Render.com configuration (render.yaml)

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (running on localhost:5432)
- Git

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. **Setup server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   npm install
   ```

3. **Create database**
   ```bash
   # Using psql or pgAdmin:
   node migrate.js
   ```

4. **Setup client**
   ```bash
   cd ../client
   npm install
   ```

5. **Start both services** (in separate terminals):
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173/
   ```

---

## Environment Setup

### Server `.env`
```
DATABASE_URL=postgres://user:password@localhost:5432/habitdb
PORT=4000
```

### Client
Vite automatically detects backend at `http://localhost:4000` during development.  
For production, set `VITE_API_URL` environment variable.

---

## API Endpoints

All endpoints return JSON.

### Habits

**GET /api/habits**
- Fetch all habits with completions and streaks
- Response: `[{ id, name, note, completions: [], streak, created_at }]`

**POST /api/habits**
- Create new habit
- Body: `{ name, note? }`
- Validation: name required (1-200 chars), note optional (max 1000 chars)

**GET /api/habits/:id**
- Get single habit with completions
- Response: `{ id, name, note, completions: [], streak, created_at }`

**PUT /api/habits/:id**
- Update habit name or note
- Body: `{ name, note? }`

**DELETE /api/habits/:id**
- Delete habit (cascades completion records)

**POST /api/habits/:id/complete**
- Mark habit complete for a date
- Body: `{ date? }` (defaults to today, YYYY-MM-DD format)
- Response: `{ completion, completions: [], streak }`

**POST /api/habits/:id/uncomplete**
- Remove completion for a date
- Body: `{ date? }`

---

## Database Schema

**habits**
- `id` SERIAL PRIMARY KEY
- `name` TEXT NOT NULL (1-200 chars)
- `note` TEXT (optional)
- `created_at` TIMESTAMP WITH TIME ZONE

**completions**
- `id` SERIAL PRIMARY KEY
- `habit_id` INTEGER FK → habits(id) ON DELETE CASCADE
- `completed_date` DATE NOT NULL
- Unique constraint: (habit_id, completed_date)

---

## Error Handling

**Validation Errors** (400)
```json
{ "error": "Name is required" }
```

**Not Found** (404)
```json
{ "error": "Not found" }
```

**Server Errors** (500)
```json
{ "error": "Internal server error" }
```

---

## Deployment

### Option 1: Render.com (Recommended)

1. **Push to GitHub** (see below)
2. **Create account at Render.com**
3. **Connect GitHub repository**
4. **Create PostgreSQL database service**
5. **Create Web service** — point to this repo, select Node.js
6. **Set environment variable:**
   - Key: `DATABASE_URL`
   - Value: Your Render PostgreSQL connection string
7. **Deploy** — Render auto-deploys on push to main branch

See `render.yaml` for configuration details.

### Option 2: Docker

```bash
# Build server image
cd server
docker build -t habit-tracker-server .

# Build client image
cd ../client
docker build -t habit-tracker-client .

# Run with Docker Compose or individually
docker run -p 4000:4000 -e DATABASE_URL=... habit-tracker-server
docker run -p 5173:5173 habit-tracker-client
```

---

## Project Structure

```
habit-tracker/
├── server/
│   ├── src/
│   │   ├── index.js              # Express app entry
│   │   ├── db.js                 # PostgreSQL pool
│   │   ├── models/
│   │   │   └── habitModel.js     # DB queries
│   │   └── routes/
│   │       └── habits.js         # API endpoints
│   ├── migrations/
│   │   └── init.sql              # DB schema
│   ├── Dockerfile                # Container config
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── main.jsx              # React entry
│   │   ├── App.jsx               # Root component
│   │   ├── api.js                # API client
│   │   ├── styles.css            # Global styles
│   │   └── components/
│   │       ├── HabitForm.jsx     # Add habit form
│   │       ├── HabitList.jsx     # Habits grid
│   │       └── HabitItem.jsx     # Single habit card
│   ├── index.html
│   └── package.json
│
├── render.yaml                   # Render deployment config
├── .gitignore
└── README.md
```

---

## Development Notes

- **Streak Calculation:** Counts consecutive days ending with today
- **CORS:** Enabled on backend, configured for localhost + Render domains
- **Validation:** Input sanitized on frontend and validated on backend
- **State Management:** Context-based in React (can upgrade to Redux)
- **Auto-reload:** Nodemon in dev, Vite HMR on client

---

## Scripts

**Server:**
- `npm run dev` — Start with Nodemon (watch mode)
- `npm start` — Start production server
- `node migrate.js` — Run database migration

**Client:**
- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

---

## Future Enhancements

- [ ] User authentication (OAuth, JWT)
- [ ] Calendar view with heatmap
- [ ] Habit analytics & progress charts
- [ ] Email reminders
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Export data (CSV/PDF)

---

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 4000 (server)
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Kill process on port 5173 (client)
netstat -ano | findstr :5173
```

**Database connection refused:**
- Ensure PostgreSQL is running: `Get-Service postgresql* | Start-Service`
- Verify `DATABASE_URL` is correct in `.env`
- Check PostgreSQL is listening on port 5432: `netstat -ano | findstr :5432`

**CORS errors:**
- Backend CORS is configured; ensure API URL in client matches backend
- During dev: backend should be `http://localhost:4000`

---

## License

MIT License — feel free to use, modify, deploy freely.

---

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing issues for solutions

