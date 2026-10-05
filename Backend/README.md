# Church Backend API

Express + TypeScript + Prisma (PostgreSQL) backend for managing church website content.

## Requirements

- Node.js (>= 18 recommended)
- PostgreSQL running locally or remotely

## Environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"

# Server
PORT=5000
NODE_ENV=development

# Auth
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"

# Initial admin (used by prisma seed)
SEED_ADMIN_EMAIL="admin@gmail.com"
SEED_ADMIN_PASSWORD="CHANGE_ME"
```

## Install

```bash
npm install
```

## Database setup (Prisma v7)

This project uses Prisma ORM v7.

- Database connection for CLI commands (migrate/seed) is configured in `prisma.config.ts`.
- Prisma schema is in `prisma/schema.prisma`.

### 1. Generate Prisma client

```bash
npm run prisma:generate
```

### 2. Run migrations

```bash
npm run prisma:migrate
```

### 3. Seed initial admin user

```bash
npm run prisma:seed
```

Notes:

- The seed creates the admin **only if the email does not already exist**.
- If you change `SEED_ADMIN_EMAIL` later and want a new admin, re-run the seed.

## Run

### Development

```bash
npm run dev
```

The API will start on:

- `http://localhost:5000`

### Production

```bash
npm run build
npm start
```

## API Docs (Swagger)

Swagger UI is available at:

- `GET /api/docs`

Example:

- `http://localhost:5000/api/docs`

## Auth / Roles

Roles:

- `ADMIN`
- `CONTENT_MANAGER`
