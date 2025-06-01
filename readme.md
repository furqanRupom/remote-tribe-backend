# 🧑‍💻 Remote Job Board API

A full-featured backend for a Remote OK-style job board built using **Node.js**, **Express**, **TypeScript**, and **Prisma**.

---

## 📁 Folder Structure

```bash
project-root/
├── dist/                           # Compiled JS (auto-generated)
├── prisma/
│   ├── migrations/                # Prisma migration history
│   ├── schema.prisma              # Main Prisma schema
│   ├── user.schema.prisma         # Optional sub-schema
│   └── application.schema.prisma  # Optional sub-schema
├── src/
│   ├── app/
│   │   ├── config/                # DB config, env, etc.
│   │   │   ├── index.ts
│   │   ├── modules/               # Modules for business logic
│   │   │   ├── auth/
│   │   │      │── auth.services.ts
│   │   │      │── auth.controller.ts
│   │   │      │── auth.routes.ts
│   │   │      │── auth.validation.ts
│   │   │      │── auth.interface.ts
│   │   │      │── index.ts # type barrier
│   │   │   ├── user/
│   │   │   └── job/
│   │   ├── builder/               # Query helpers
│   │   │   └── queryBuilder.ts
│   │   ├── middleware/            # Auth, error middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── utils/
│   │   ├── logger/
│   │   ├── mailer/
│   │   ├── redis/
│   │   ├── helpers/
│   │   ├── shared/
│   │   └── routes/
│   │       └── routes.ts  # All the routes from module import here
│   ├── app.ts                     # Creates and configures Express app
│   ├── prisma.ts                  # Prisma client init
│   └── server.ts                  # Starts the server
├── tests/                         # Jest test files
│   ├── setup.ts
│   └── auth.test.ts
├── .env                           # Environment variables
├── .env.test                      # Test DB config
├── tsconfig.json
├── jest.config.js
├── package.json
└── README.md
```

---

## 📦 Tech Stack

* **Node.js** + **Express**
* **TypeScript**
* **Prisma** ORM
* **PostgreSQL** (or any SQL DB)
* **JWT** Auth
* **Zod** for validation
* **Jest** for testing

---

## 🔐 Authentication Endpoints

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /auth/register | Register new user        |
| POST   | /auth/login    | Login & receive JWT      |
| POST   | /auth/logout   | Logout user              |
| GET    | /auth/me       | Get current user profile |

---

## 👤 User Endpoints

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| GET    | /users/\:id | Get user by ID      |
| PATCH  | /users/\:id | Update user profile |

---

## 💼 Job Endpoints (with filters)

| Method | Endpoint   | Description                                  |
| ------ | ---------- | -------------------------------------------- |
| GET    | /jobs      | Get jobs (paginated, searchable, filterable) |
| GET    | /jobs/\:id | Get job details by ID                        |
| POST   | /jobs      | Create a job (employer only)                 |
| PATCH  | /jobs/\:id | Update a job (employer only)                 |
| DELETE | /jobs/\:id | Delete a job (employer only)                 |

### Job Query Parameters

* `search`: string (title, description, tags)
* `type`: 'full-time' | 'part-time' | 'contract'
* `location`: string
* `tags`: comma-separated tags (e.g. `remote,javascript`)
* `isRemote`: boolean
* `sortBy`: `createdAt`, `salaryRange`, etc.
* `order`: `asc` or `desc`
* `page`: number (default 1)
* `limit`: number (default 10)

---

## 📥 Application Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | /jobs/\:jobId/apply    | Apply to a job           |
| GET    | /users/me/applications | List my job applications |

---

## 🛡️ Admin Endpoints

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | /admin/jobs              | List all unapproved jobs   |
| PATCH  | /admin/jobs/\:id/approve | Approve a pending job post |
| DELETE | /admin/jobs/\:id         | Delete job post            |

---

## ✅ How to Run

```bash
git clone <repo-url>
cd project-root

# Install dependencies
npm install

# Setup env
cp .env.example .env

# Generate Prisma client & migrate DB
npx prisma generate
npm prisma migrate dev

# Start dev server
npm run dev
```

---

## 🧪 Running Tests

```bash
npm  test
```

---

## ✨ Extras

* Rate limiting (optional middleware)
* Job analytics (e.g., view counts) – future enhancement
* Email notifications – future enhancement

---

## 📬 Contact

For questions, email [furqanrupom978@gmail.com](mailto:furqanrupom978@gmail.com) or raise an issue.
