# Exercise — React: Appointment Day Board

**Timebox:** 30–40 minutes  
**Repo area:** `frontend/src/pages/` (and small API helper changes if needed)  
**Prereq:** App running in mock or Oracle mode.

## Candidate brief (share this)

Build a **Day Board** view for Harbor Clinic reception.

### Requirements

1. Add a route `/day-board` (and nav link) showing appointments for a **selected calendar date** (default: today).  
2. Fetch appointments from the existing API. Prefer adding a `from`/`to` query on `GET /api/appointments` if not already used by the UI.  
3. Group rows into three sections: **Morning** (&lt; 12:00), **Afternoon** (12:00–17:00), **Evening** (≥ 17:00) local time.  
4. Each row: time, patient name + MRN, doctor, status badge.  
5. Inline control to mark an appointment `CHECKED_IN` from the board (reuse existing PATCH status API).  
6. Empty states per section (“No morning appointments”).  
7. Loading and error states.

### Out of scope

Drag-and-drop, websockets, printing, new backend business rules beyond date filtering.

### Deliverable

Working UI + short note (5–8 lines) on how date boundaries are computed.

---

## Grader — expected solution sketch

### Approach

1. **Routing:** add `<Route path="day-board" element={<DayBoard />} />` in `App.jsx`; `NavLink` in `Layout.jsx`.  
2. **Date state:** `<input type="date">` bound to `selectedDate` (`YYYY-MM-DD`).  
3. **Query window:**  
   ```js
   const from = new Date(`${selectedDate}T00:00:00`);
   const to = new Date(`${selectedDate}T23:59:59.999`);
   api(`/appointments?from=${from.toISOString()}&to=${to.toISOString()}`)
   ```  
   Backend already supports `from`/`to` in `listAppointments`.  
4. **Group:**  
   ```js
   const hour = new Date(a.scheduledAt).getHours();
   // morning: hour < 12, afternoon: hour < 17, else evening
   ```  
5. **Check-in:** `PATCH /appointments/:id/status` with `{ status: 'CHECKED_IN' }`, then refetch.  
6. **UX:** three `<section className="panel">` blocks; reuse `.badge` classes.

### Acceptance checks

- Changing the date changes the list.  
- An appointment at 09:00 appears only under Morning.  
- Check-in updates badge without full page reload.  
- No console errors; auth still required.

### Partial credit

- Date filter without grouping: up to ~60%  
- Grouping client-side but fetching all appointments: up to ~75% if still correct for the day  
- Missing empty/loading states: −10%
