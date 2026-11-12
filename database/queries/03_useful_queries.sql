-- Useful Oracle queries for HMS assessment demos / grading

-- 1. Today's appointments with patient and doctor names
SELECT
  a.appointment_id,
  a.scheduled_at,
  a.status,
  p.mrn,
  p.first_name || ' ' || p.last_name AS patient_name,
  d.first_name || ' ' || d.last_name AS doctor_name,
  dep.name AS department
FROM appointments a
JOIN patients p     ON p.patient_id = a.patient_id
JOIN doctors d      ON d.doctor_id = a.doctor_id
JOIN departments dep ON dep.department_id = d.department_id
WHERE TRUNC(a.scheduled_at) = TRUNC(SYSDATE)
ORDER BY a.scheduled_at;

-- 2. Doctor workload (next 7 days, non-cancelled)
SELECT
  d.doctor_id,
  d.first_name || ' ' || d.last_name AS doctor_name,
  COUNT(*) AS appt_count,
  SUM(a.duration_minutes) AS total_minutes
FROM appointments a
JOIN doctors d ON d.doctor_id = a.doctor_id
WHERE a.scheduled_at >= TRUNC(SYSDATE)
  AND a.scheduled_at < TRUNC(SYSDATE) + 7
  AND a.status NOT IN ('CANCELLED')
GROUP BY d.doctor_id, d.first_name, d.last_name
ORDER BY appt_count DESC;

-- 3. Patients with no future scheduled appointments
SELECT p.patient_id, p.mrn, p.first_name, p.last_name, p.phone
FROM patients p
WHERE NOT EXISTS (
  SELECT 1
  FROM appointments a
  WHERE a.patient_id = p.patient_id
    AND a.scheduled_at >= SYSTIMESTAMP
    AND a.status = 'SCHEDULED'
)
ORDER BY p.last_name, p.first_name;

-- 4. Appointment status breakdown by department (last 30 days)
SELECT
  dep.code,
  dep.name,
  a.status,
  COUNT(*) AS cnt
FROM appointments a
JOIN doctors d      ON d.doctor_id = a.doctor_id
JOIN departments dep ON dep.department_id = d.department_id
WHERE a.scheduled_at >= TRUNC(SYSDATE) - 30
GROUP BY dep.code, dep.name, a.status
ORDER BY dep.code, a.status;

-- 5. Search patients by last-name prefix (bind variable style)
-- :last_name_prefix e.g. 'Jo%'
SELECT patient_id, mrn, first_name, last_name, date_of_birth, phone
FROM patients
WHERE UPPER(last_name) LIKE UPPER(:last_name_prefix)
ORDER BY last_name, first_name;
