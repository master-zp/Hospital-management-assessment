# Rubric — Oracle Schema & SQL Quality (HMS)

Score each criterion 0–2. Max **20**.

| # | Criterion | 0 | 1 | 2 |
|---|-----------|---|---|---|
| 1 | **Normalization** | Flat / redundant | Mostly 3NF with slips | Clear entities; FKs match domain |
| 2 | **Constraints** | PK only | Some checks/uniques | PK/FK/CHECK/UNIQUE aligned to rules |
| 3 | **Keys & identity** | Manual IDs ad hoc | Sequences or identity | Sequences/identity + safe insert pattern |
| 4 | **Indexes** | None beyond PK | Random indexes | Selective indexes for FK + query paths |
| 5 | **SQL correctness** | Wrong results | Edge-case bugs | Correct joins/filters; timezone/TRUNC awareness |
| 6 | **Bind variables** | Literals only | Mixed | Binds for all user inputs |
| 7 | **Set-based thinking** | Row-by-row PL/SQL for simple reports | Mixed | Single SQL / analytic where appropriate |
| 8 | **Readability** | Cryptic | OK | Aliases, formatting, comments on intent |
| 9 | **Oracle dialect** | Generic SQL that fails on Oracle | Minor dialect issues | Valid Oracle (DUAL, TRUNC, INTERVAL, etc.) |
| 10 | **Explain / tradeoffs** | Cannot justify | Vague | Can discuss index choice, cardinality, NULL status |

## HMS-specific probes

- Why unique on `(doctor_id, scheduled_at)` vs exclusion of overlapping ranges?  
- Soft-delete `is_active` vs hard delete for doctors  
- MRN uniqueness and generation strategy  
- Filtering appointments with `TRUNC(scheduled_at)` vs range on indexed column (sargability)

## Red flags

- Missing FK from appointments → patients/doctors  
- Status free-text with no CHECK  
- Functions on indexed columns in WHERE that disable index use, without awareness  
- Storing passwords reversible / plaintext in `USERS`
