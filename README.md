# Modket – Campus Marketplace for Mody University

End-to-end full-stack platform where students buy and sell inside campus using their `@modyuniversity.ac.in` email. Includes direct gallery uploads, order approvals, live Q&A, dashboards, and detailed activity tracking.

## Project Structure

```
ModketClean/
├── client/             # React + Vite + Tailwind frontend
├── server/             # Express + MongoDB backend with sockets
├── docker-compose.yml  # Optional containerized setup
└── README.md
```

### Backend Highlights

- Node.js + Express + MongoDB + Mongoose
- JWT auth restricted to campus domain
- Multer-based direct image uploads (stored in `/uploads`)
- Models: User, Product, Image, Order, Question, Activity
- Order approval workflow & activity logger
- Socket.io for live Q&A threads
- Modular controllers/routes/middleware for clean maintenance

### Frontend Highlights

- React + Vite + TailwindCSS
- Axios client with JWT interceptor & `AuthContext`
- Buyer UI: product grid, detail pages, Q&A, order modal, dashboard
- Seller UI: seller dashboard, create/manage products, approval queue, Q&A inbox
- Image uploader with previews, removal, and reordering
- Socket.io client hook for joining product rooms

## Quick Start (Manual Install)

1. **Install dependencies**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure environment**

   - Copy `.env.example` → `.env` inside both `server/` and `client/`
   - Update values (Mongo URI, JWT secret, origins, etc.)

3. **Start MongoDB** locally or via Mongo Atlas.

4. **Run backend**

   ```bash
   cd server
   npm run dev
   ```

5. **Run frontend**

   ```bash
   cd client
   npm run dev
   ```

6. Visit `http://localhost:5173`

## Docker Compose

One command bootstraps MongoDB, API, and frontend:

```bash
docker compose up --build
```

Services:

- `mongo` (MongoDB 6)
- `server` (Express API on `localhost:5000`)
- `client` (Vite dev server on `localhost:5173`)

## API Overview

| Endpoint                           | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `POST /api/auth/register`          | Campus email registration                  |
| `POST /api/auth/login`             | JWT login                                  |
| `GET /api/auth/me`                | Profile details                            |
| `POST /api/products`               | Seller creates product w/ images           |
| `GET /api/products`                | Public product grid                        |
| `POST /api/orders`                 | Buyer places order                         |
| `PATCH /api/orders/:id/approve`    | Seller approves order                      |
| `POST /api/questions`              | Buyer asks question                        |
| `POST /api/questions/:id/answer`   | Seller answers question                    |
| `GET /api/activities`              | Dashboard activity feed                    |

Explore all route handlers under `server/src/routes`.

## Activity Tracking & Realtime Q&A

- `server/src/utils/activityLogger.js` tracks events such as user/register, product create/update, image upload, order lifecycle, and Q&A actions.
- Socket server (`server/src/socket`) creates product rooms. Frontend `useSocket` hook joins/leaves rooms and listens for `question:new` / `question:answer` / `order:update`.

## Seed Data

```bash
cd server
npm run seed
```

Creates demo seller, buyer, and calculator product for testing.

## Environment Templates

- `server/.env.example`
- `client/.env.example`

Fill them to match your local/Docker environments.

## Scripts Summary

| Location | Script         | Purpose                        |
| -------- | ---------------- | ------------------------------ |
| server   | `npm run dev`    | Nodemon API + Socket.io        |
| server   | `npm run seed`   | Seed demo data                 |
| client   | `npm run dev`    | Vite dev server                |
| root     | `docker compose up` | All services via containers |

Enjoy building with Modket! 🚀

