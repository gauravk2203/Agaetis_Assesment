# Employee Management System

A full-stack Employee Management CRUD application built using React, TypeScript, Express, Prisma ORM, and PostgreSQL.

## Tech Stack

**Frontend**
- React + Vite
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

## Features

- Create employees
- View all employees
- View employee details
- Update employee information
- Delete employees
- Search employees
- Duplicate email validation
- REST API integration

## Installation

### Backend

```bash
cd Backend
pnpm install
```

Configure your `.env` file:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
```

Run migrations and generate Prisma Client:

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

Start the backend:

```bash
pnpm dev
```

### Frontend

```bash
cd frontend
pnpm install
```

Configure `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
pnpm dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/employees | Get employees |
| GET | /api/employees/:id | Get employee |
| POST | /api/employees | Create employee |
| PATCH | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |


## Developer Portfolio

🌐 [Gaurav Kadam – Portfolio](https://gaurav-kadam.netlify.app/)

## License

MIT