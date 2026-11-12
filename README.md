# Harbor Clinic — Hospital Management System (Assessment)

Practical fullstack vertical slice for internal technical assessments:

- **React** (Vite) frontend — patients, appointments, doctors/departments, JWT login
- **Node.js / Express** API — REST endpoints, `oracledb` or mock mode
- **Oracle Database** — DDL, constraints, indexes, seed SQL, sample queries

## Quick start (no Oracle required)

Mock mode ships seeded in-memory data so candidates and graders can explore the UI immediately.

```bash
cp .env.example .env
# DB_MODE=mock is the default

cd backend && npm install && npm start
# API → http://localhost:4000

# new terminal
cd frontend && npm install && npm run dev
# UI → http://localhost:5173
```

**Demo login:** `reception` / `Password123!`  
Also: `admin`, `drchen` (same password).

## Project layout

```
hospital-assessment/
├── README.md
├── .env.example
├── docker-compose.oracle.yml
├── database/
│   ├── ddl/01_schema.sql
│   ├── seed/02_seed.sql
│   ├── queries/03_useful_queries.sql
│   └── er-overview.md
├── backend/          # Express + oracledb | mock
└── frontend/         # React + Vite
```

## Modules

| Area | What works |
|------|------------|
| Auth | Login, JWT Bearer, `/api/auth/me` |
| Patients | List/search, register, MRN auto-assign |
| Appointments | List/filter by status, book, update status |
| Doctors | List/filter by department |
| Departments | List with floor/ext |

## Oracle setup (optional / preferred for SQL exercises)

### 1. Start Oracle XE (Docker)

```bash
docker compose -f docker-compose.oracle.yml up -d
# Wait until healthy (first boot can take a few minutes)
```

Compose creates user `hms_app` / `hms_app_pwd` (see `docker-compose.oracle.yml`).

Connect string for the API:

```
localhost:1521/XEPDB1
```

### 2. Apply schema + seed

Using SQL*Plus, SQLcl, or any Oracle client as `hms_app`:

```bash
sqlplus hms_app/hms_app_pwd@localhost:1521/XEPDB1 @database/ddl/01_schema.sql
sqlplus hms_app/hms_app_pwd@localhost:1521/XEPDB1 @database/seed/02_seed.sql
```

### 3. Align seed password hashes (recommended)

Seed SQL includes a placeholder bcrypt string. Generate a real hash and update `USERS.PASSWORD_HASH` (or re-seed):

```bash
cd backend && npm run hash-password -- Password123!
# then UPDATE users SET password_hash = '<output>' ;
```

Mock mode always hashes `Password123!` at process start, so UI login works without this step.

### 4. Point the API at Oracle

Edit `.env`:

```
DB_MODE=oracle
ORACLE_USER=hms_app
ORACLE_PASSWORD=hms_app_pwd
ORACLE_CONNECT_STRING=localhost:1521/XEPDB1
JWT_SECRET=replace-with-a-long-random-string
```

Restart the backend. Confirm:

```bash
curl http://localhost:4000/api/health
# {"ok":true,"dbMode":"oracle","service":"hms-api"}
```

### node-oracledb notes

- `oracledb` 6.x can run in **Thin mode** (no Instant Client) for many XE setups.
- If Thick mode is required in your environment, install Oracle Instant Client and set `ORACLE_CLIENT_LIB_DIR` per [node-oracledb docs](https://node-oracledb.readthedocs.io/).

## API overview

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/health` | no | mode probe |
| POST | `/api/auth/login` | no | `{username,password}` |
| GET | `/api/auth/me` | yes | current user |
| GET | `/api/patients?q=` | yes | search |
| POST | `/api/patients` | yes | register |
| GET | `/api/appointments` | yes | `status`, `doctorId`, `from`, `to` |
| POST | `/api/appointments` | yes | book |
| PATCH | `/api/appointments/:id/status` | yes | status transition |
| GET | `/api/doctors?departmentId=` | yes | |
| GET | `/api/departments` | yes | |

## Assessment materials (store docs)

Assessor overview, rubrics, and coding exercises live in the Project store under `docs/` (copied alongside this package for convenience — see store paths in the assessor overview).

## Design notes

- Clinical, calm UI (teal accent, Source Sans / Source Serif) — not a generic purple marketing theme.
- Scope is intentionally a **vertical slice**, not a full HIS/EMR.
- Double-booking protection: unique index on `(doctor_id, scheduled_at)`.
