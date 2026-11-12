# Harbor Clinic HMS — Assessor Overview

Internal fullstack assessment package (React + Node + Oracle) for evaluating practical hospital-domain engineering skills.

## Package locations

| Deliverable | Absolute path |
|-------------|---------------|
| Application root | `/agent/hospital-assessment/` |
| This overview | `/cursor/stores/self/docs/assessor-overview.md` |
| React rubric | `/cursor/stores/self/docs/rubrics/react-code-quality.md` |
| Node API rubric | `/cursor/stores/self/docs/rubrics/node-api-design.md` |
| Oracle rubric | `/cursor/stores/self/docs/rubrics/oracle-schema-sql.md` |
| React exercise | `/cursor/stores/self/docs/exercises/react-appointment-day-board.md` |
| SQL exercise | `/cursor/stores/self/docs/exercises/sql-doctor-utilization.md` |
| App README | `/agent/hospital-assessment/README.md` |
| Oracle ER notes (app) | `/agent/hospital-assessment/database/er-overview.md` |
| Oracle ER notes (store) | `/cursor/stores/self/docs/oracle-er-overview.md` |

A copy of the assessor-facing docs is also mirrored under `/agent/hospital-assessment/docs/` for offline handoff with the codebase.

## What candidates get

A runnable **Harbor Clinic** HMS vertical slice:

1. Patient registration & search  
2. Appointments (book + status updates)  
3. Doctors & departments  
4. Basic JWT auth  

**Default run mode:** `DB_MODE=mock` (in-memory) — no Oracle install required to explore UI/API.  
**SQL / schema exercises:** use provided Oracle DDL + Docker XE compose file.

## Suggested assessment flow (90–120 min technical)

1. **Explore (15–20 min):** run app in mock mode; walk patients → appointments → doctors.  
2. **Code review discussion (20–30 min):** use rubrics against the starter code *or* candidate PR.  
3. **React exercise (30–40 min):** day board filter (see exercises).  
4. **Oracle/SQL exercise (30–40 min):** doctor utilization query + index rationale.

## How to run (grader cheat sheet)

```bash
cd /agent/hospital-assessment
cp .env.example .env
cd backend && npm install && npm start
cd ../frontend && npm install && npm run dev
```

Login: `reception` / `Password123!`  
Health: `GET http://localhost:4000/api/health`

Oracle (optional): see README + `docker-compose.oracle.yml`.

## Scoring weights (suggested)

| Area | Weight |
|------|--------|
| React UI / state / API integration | 30% |
| Node API design & correctness | 30% |
| Oracle schema & SQL | 30% |
| Communication / tradeoffs | 10% |

Use the three rubrics for detailed criteria. Exercises include expected solution sketches for graders (not shown to candidates unless take-home allows).

## Intentionally out of scope

Billing, clinical notes/EHR, HL7/FHIR, role-permission matrices beyond simple JWT roles, audit UI, multi-tenancy, production hardening.
