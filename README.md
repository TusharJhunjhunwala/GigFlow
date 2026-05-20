# GigFlow - Smart Leads Dashboard

Full-stack lead management dashboard for the ServiceHive assignment. The app uses React, TypeScript, TailwindCSS, Node.js, Express, MongoDB, Mongoose, JWT authentication, and role-based access control.

## Features

- JWT authentication with registration, login, protected routes, bcrypt password hashing, and auth middleware.
- Role-based access for `admin` and `sales` users. Admins can view and manage all leads; sales users manage their own leads.
- Lead CRUD with fields for name, email, status, source, owner, and created date.
- Combined backend filtering by status, source, debounced name/email search, latest/oldest sorting, and 10-record pagination.
- CSV export for the currently filtered lead set.
- Responsive React dashboard with reusable components, form validation, loading states, empty states, error states, and dark mode.
- Centralized API errors, Zod request validation, clean response format, and API documentation.
- Docker setup for MongoDB, backend, and frontend.

## Tech Stack

- Frontend: React.js, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB with Mongoose
- Auth: JWT and bcrypt
- Validation: Zod

## Local Setup

Live deployment: `https://gigflowproject.netlify.app/`

1. Install dependencies:

```bash
npm install
```

2. Create environment files. Keep `VITE_API_URL` pointed at the backend API for the environment you are running:

```bash
cp .env.example .env
cp .env.example client/.env
```

3. Start MongoDB locally, or run only MongoDB with Docker:

```bash
docker compose up mongo
```

4. Seed demo users and leads:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:4000`

## Demo Accounts

After running `npm run seed`:

- Admin: `admin@gigflow.test` / `Admin@12345`
- Sales: `sales@gigflow.test` / `Sales@12345`

## Docker Setup

Run the complete stack:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:4000/health`

## API Documentation

See [docs/API.md](docs/API.md) for request and response examples.

## Useful Scripts

- `npm run dev` - run server and client together.
- `npm run build` - build both workspaces.
- `npm run typecheck` - run TypeScript checks for both workspaces.
- `npm run seed` - create demo users and sample leads.

## Suggested Loom Workflow

1. Register or log in as admin.
2. Show protected dashboard access and role badge.
3. Create a lead, update its status/source, open details, and delete a lead.
4. Demonstrate combined filters: status, source, debounced search, sort, and pagination.
5. Export the filtered leads as CSV.
6. Log in as the sales user and show that only assigned leads are visible.
