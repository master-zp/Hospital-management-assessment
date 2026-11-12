# Rubric — React Code Quality (HMS)

Score each criterion 0–2 (0 missing, 1 partial, 2 solid). Max **20**.

| # | Criterion | 0 | 1 | 2 |
|---|-----------|---|---|---|
| 1 | **Component structure** | Monolith / unclear | Some splits, inconsistent | Clear pages/components, single responsibility |
| 2 | **Data fetching** | Hardcoded / fake only | Fetch present but racey or unhandled | Proper loading/error/empty; cancels or ignores stale where needed |
| 3 | **Forms & validation** | No validation | Browser-only / incomplete | Required fields, sensible UX messages, controlled inputs |
| 4 | **Auth handling** | Token ignored | Stored but routes open | Protected routes, Authorization header, logout clears session |
| 5 | **List UX** | Unusable table | Basic table | Search/filter wired to API; readable clinical layout |
| 6 | **State management** | Prop soup / globals | Local state OK but noisy | Appropriate local/context; no unnecessary global store |
| 7 | **Accessibility basics** | Missing labels | Partial | Labels, button types, keyboard-usable controls |
| 8 | **Styling quality** | Broken / default AI purple aesthetic | Usable but inconsistent | Cohesive clinical theme; responsive enough for laptop |
| 9 | **Error surfacing** | Silent failures | Alert/console only | Inline errors from API messages |
| 10 | **Exercise solution quality** | Incomplete | Works with bugs | Meets brief; clean diffs; no regressions |

## HMS-specific probes

- Does patient search debounce or at least re-query intentionally?  
- Appointment status updates optimistic or refetch? Either OK if consistent.  
- Are dates shown in local time without corrupting ISO payloads to the API?

## Red flags

- Secrets or JWT secret in frontend source  
- Storing password in `localStorage`  
- Fetch without auth header on protected resources  
- Mutating props / shared arrays in place across renders
