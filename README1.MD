# Monorepo Paytm Clone Setup Guide

This document explains how to set up the project from scratch including:

* Docker PostgreSQL
* Prisma setup
* Turborepo development environment
* NextAuth authentication

Follow the steps **in order**.

---

# 1. Clone the Repository

```bash
git clone <repository-url>
cd Monorepo-paytm
```

---

# 2. Install Dependencies

Install all workspace dependencies from the root of the project.

```bash
npm install
```

---

# 3. Start PostgreSQL using Docker

Run PostgreSQL container.

```bash
docker run -d --name digipay-postgres -e POSTGRES_USER=digipay -e POSTGRES_PASSWORD=digipay123 -e POSTGRES_DB=digipaydb -p 5432:5432 postgres:15
```

Verify container is running.

```bash
docker ps
```

Expected output should contain:

```
digipay-postgres
0.0.0.0:5432->5432/tcp
```

---

# 4. Verify Database Connection

Connect to PostgreSQL container.

```bash
docker exec -it digipay-postgres psql -U digipay -d digipaydb
```

You should see:

```
digipaydb=#
```

Exit using:

```sql
\q
```

---

# 5. Configure Environment Variables

Create `.env` file in the required apps.

Example:

```
DATABASE_URL="postgresql://digipay:digipay123@localhost:5432/digipaydb"
NODE_ENV="development"
NEXTAUTH_SECRET="secret"
NEXTAUTH_URL="http://localhost:3001"
```

---

# 6. Generate Prisma Client

Navigate to the Prisma package.

```
cd packages/db
```

Generate Prisma client.

```bash
npx prisma generate
```

---

# 7. Push Prisma Schema to Database

Create database tables.

```bash
npx prisma db push
```

Expected output:

```
Your database is now in sync with your Prisma schema
```

---

# 8. Verify Database Tables

Run Prisma Studio.

```bash
npx prisma studio
```

Open browser:

```
http://localhost:5555
```

You should see tables like:

```
User
Account
Balance
Transaction
```

---

# 9. Start Development Server

Return to project root.

```
cd ../../
```

Start Turborepo development server.

```bash
npm run dev
```

This starts all applications.

Example output:

```
web → http://localhost:3000
docs/user-app → http://localhost:3001
```

---

# 10. Run Individual App (Optional)

To run only the user app:

```bash
cd apps/user-app
npm run dev
```

---

# 11. Authentication Flow

The application uses **NextAuth Credentials Provider**.

Authentication flow:

```
User Login
   ↓
NextAuth Credentials Provider
   ↓
authorize()
   ↓
Prisma query → User table
   ↓
Session created
```

---

# 12. Common Errors and Fixes

### Error: Database not reachable

```
Can't reach database server at localhost:5432
```

Solution:

```
docker start digipay-postgres
```

---

### Error: Table does not exist

```
The table public.User does not exist
```

Solution:

```
cd packages/db
npx prisma db push
```

---

### Error: Cannot find Prisma schema

```
Could not find schema.prisma
```

Solution:

Run Prisma commands from:

```
packages/db
```

---

### Error: Module not found `@/lib/auth`

Check that `lib/auth.ts` exists inside the app and the path alias is configured in `tsconfig.json`.

---

# 13. Useful Commands

Stop container:

```
docker stop digipay-postgres
```

Start container:

```
docker start digipay-postgres
```

Remove container:

```
docker rm digipay-postgres
```

Check running containers:

```
docker ps
```

---

# 14. Project Structure

```
Monorepo-paytm
│
├─ apps
│   ├─ web
│   └─ user-app
│
├─ packages
│   ├─ db
│   │   └─ prisma
│   │       └─ schema.prisma
│   └─ ui
│
└─ turbo.json
```

---

# 15. Development Stack

* Next.js 14
* Turborepo
* Prisma ORM
* PostgreSQL
* Docker
* NextAuth

---

# 16. Notes

* Always run Prisma commands from `packages/db`.
* PostgreSQL runs inside Docker.
* Environment variables must be configured before starting the server.

---

# Setup Complete

The project should now run successfully.

Visit:

```
http://localhost:3001
```

for the user application.
