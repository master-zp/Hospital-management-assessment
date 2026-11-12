# Rubric — Node API Design (HMS)

Score each criterion 0–2. Max **20**.

| # | Criterion | 0 | 1 | 2 |
|---|-----------|---|---|---|
| 1 | **Route design** | RPC soup / inconsistent | REST-ish | Clear resources, verbs, status codes |
| 2 | **Validation** | Trusts all input | Partial checks | Required fields + domain checks (gender, status) |
| 3 | **AuthN** | Open API | Login only | JWT middleware on protected routes |
| 4 | **DB access** | String concat SQL | Mostly bound | Bind variables everywhere; pool lifecycle |
| 5 | **Error handling** | Crashes / HTML errors | Catch but leaky | Centralized handler; 4xx vs 5xx; no stack to client |
| 6 | **Idempotency / conflicts** | Ignores unique violations | Generic 500 | Maps Oracle unique → 409 (e.g. double-book) |
| 7 | **Config** | Hardcoded secrets | Some env | `.env.example`, no secrets committed |
| 8 | **Layering** | Logic in routes only | Partial service | Routes thin; service/data layer testable |
| 9 | **Health / operability** | None | Basic ping | Health exposes mode without leaking secrets |
| 10 | **Exercise / extension quality** | Breaks existing | Works | Clean endpoint + consistent response shape |

## HMS-specific probes

- Password verify uses bcrypt (or equivalent), never plaintext compare  
- Appointment create rejects missing `patientId` / `doctorId` / `scheduledAt`  
- Status PATCH whitelist matches DB check constraint  
- Mock vs Oracle paths stay behaviorally aligned

## Red flags

- SQL injection via string interpolation  
- Returning `password_hash` in JSON  
- `autoCommit` misuse leaving partial writes (when multi-statement)  
- CORS `*` with credentials in a “secure” claim without justification
