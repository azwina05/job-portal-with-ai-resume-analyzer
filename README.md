# AI Job Portal Backend (MERN)

Beginner-friendly Express + MongoDB backend for the AI Job Portal frontend.

## Features

- JWT authentication (Register / Login / Me)
- Role-based authorization (seeker / provider / admin)
- Jobs API (create, list, update, delete)
- Applications API (apply, view my applications, employer inbox)
- Resume upload using Multer (`resume` file field)
- Simple AI Resume Analyzer (skill keyword matching)

## Folder structure

```
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
```

## Setup

1) Install MongoDB locally (or use MongoDB Atlas).

2) Create `.env` in `backend/` (already created in this project) and set:

- `MONGO_URI`
- `JWT_SECRET`

3) Install dependencies and run:

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

## API quick reference

### Auth

- `POST /api/auth/register` `{ name, email, password, role }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (Bearer token)

### Jobs

- `GET /api/jobs`
- `POST /api/jobs` (provider/admin)
- `PUT /api/jobs/:id` (owner/admin)
- `DELETE /api/jobs/:id` (owner/admin)

### Applications

- `POST /api/applications` (seeker/admin, supports multipart)
  - `jobId` (required)
  - `resume` (file field, optional)
  - `resumeText` (optional, used for skill matching)
  - `skills` (optional, array or comma-separated)
- `GET /api/applications/me` (seeker/admin)
- `GET /api/applications/employer` (provider/admin)
- `PUT /api/applications/:id/status` (provider/admin)

### Admin

- `GET /api/admin/overview`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `GET /api/admin/jobs`
- `PUT /api/admin/jobs/:id/toggle`

