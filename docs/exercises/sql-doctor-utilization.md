# Exercise — Oracle SQL: Doctor Utilization Report

**Timebox:** 30–40 minutes  
**Repo area:** `database/` (candidate writes a new `.sql` file; optional API endpoint is bonus)  
**Prereq:** Schema + seed applied to Oracle XE (or equivalent). Mock mode alone is **not** sufficient for this exercise.

## Candidate brief (share this)

Reception leadership wants a **doctor utilization** report for capacity planning.

### Requirements

Write an Oracle SQL script `database/queries/doctor_utilization.sql` that, for a bind window:

- `:start_ts` — inclusive start (`TIMESTAMP`)  
- `:end_ts` — exclusive end (`TIMESTAMP`)

returns one row per **active** doctor with:

| Column | Meaning |
|--------|---------|
| `doctor_id` | |
| `doctor_name` | `last_name \|\| ', ' \|\| first_name` |
| `department_code` | from `departments.code` |
| `scheduled_count` | appointments in window with `status IN ('SCHEDULED','CHECKED_IN','COMPLETED')` |
| `completed_count` | `status = 'COMPLETED'` in window |
| `cancelled_or_no_show` | `status IN ('CANCELLED','NO_SHOW')` in window |
| `booked_minutes` | `SUM(duration_minutes)` for scheduled/checked_in/completed in window |
| `utilization_pct` | `booked_minutes / (:work_minutes)` * 100, rounded to 1 decimal. Use bind `:work_minutes` (e.g. 2400 for a 5-day clinic week). Doctors with zero booked minutes still appear with `0`. |

### Rules

- Include doctors with **zero** appointments in the window (outer pattern).  
- Only `doctors.is_active = 'Y'`.  
- Use bind variables (no literals for the window).  
- Order by `utilization_pct DESC`, then `doctor_name`.

### Short written answers (in comments at top of file)

1. Would an index on `appointments(status)` alone be enough for this report? Why/why not?  
2. Why prefer `scheduled_at >= :start_ts AND scheduled_at < :end_ts` over `TRUNC(scheduled_at)`?

### Bonus (optional)

`GET /api/reports/doctor-utilization?from=&to=&workMinutes=` returning the same shape as JSON.

---

## Grader — expected solution sketch

```sql
-- doctor_utilization.sql
SELECT
  d.doctor_id,
  d.last_name || ', ' || d.first_name AS doctor_name,
  dep.code AS department_code,
  NVL(SUM(CASE WHEN a.status IN ('SCHEDULED','CHECKED_IN','COMPLETED') THEN 1 ELSE 0 END), 0)
    AS scheduled_count,
  NVL(SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END), 0)
    AS completed_count,
  NVL(SUM(CASE WHEN a.status IN ('CANCELLED','NO_SHOW') THEN 1 ELSE 0 END), 0)
    AS cancelled_or_no_show,
  NVL(SUM(CASE WHEN a.status IN ('SCHEDULED','CHECKED_IN','COMPLETED')
               THEN a.duration_minutes END), 0)
    AS booked_minutes,
  ROUND(
    NVL(SUM(CASE WHEN a.status IN ('SCHEDULED','CHECKED_IN','COMPLETED')
                 THEN a.duration_minutes END), 0) / :work_minutes * 100
  , 1) AS utilization_pct
FROM doctors d
JOIN departments dep ON dep.department_id = d.department_id
LEFT JOIN appointments a
  ON a.doctor_id = d.doctor_id
 AND a.scheduled_at >= :start_ts
 AND a.scheduled_at <  :end_ts
WHERE d.is_active = 'Y'
GROUP BY d.doctor_id, d.last_name, d.first_name, dep.code
ORDER BY utilization_pct DESC, doctor_name;
```

### Written answer keys

1. **No.** The selective predicate is primarily time-range on `scheduled_at` (and doctor). Status-only index does not help the range scan; composite `(doctor_id, scheduled_at)` or `(scheduled_at)` is more relevant. Status can be lower in a composite if highly selective for a different query.  
2. **`TRUNC(scheduled_at)`** applies a function to the column → typically **non-sargable**, hard to use a plain index on `scheduled_at`. A half-open range preserves index use and avoids timezone/day-boundary surprises when binds are proper timestamps.

### Acceptance checks

- Inactive doctors excluded.  
- Doctor with no appointments in window present with zeros.  
- Cancelled visits do not inflate `booked_minutes`.  
- Binds used for window and work minutes.

### Partial credit

- Inner join only (drops zero doctors): ~70%  
- Correct counts but utilization wrong: ~80%  
- Literals instead of binds: −10%
