-- Hospital Management System — sample seed data
-- Password for all demo users: Password123!
-- bcrypt hash (cost 10) from: cd backend && npm run hash-password -- Password123!

-- Users
INSERT INTO users (user_id, username, password_hash, full_name, role, is_active)
VALUES (seq_users.NEXTVAL, 'admin',
  '$2a$10$pWQHPgTRqUZH9FOt4dUV5OBbbMXfL6k29eo4Fwd2MelX9hZ6Qxp.y',
  'System Administrator', 'ADMIN', 'Y');

INSERT INTO users (user_id, username, password_hash, full_name, role, is_active)
VALUES (seq_users.NEXTVAL, 'reception',
  '$2a$10$pWQHPgTRqUZH9FOt4dUV5OBbbMXfL6k29eo4Fwd2MelX9hZ6Qxp.y',
  'Front Desk Staff', 'STAFF', 'Y');

INSERT INTO users (user_id, username, password_hash, full_name, role, is_active)
VALUES (seq_users.NEXTVAL, 'drchen',
  '$2a$10$pWQHPgTRqUZH9FOt4dUV5OBbbMXfL6k29eo4Fwd2MelX9hZ6Qxp.y',
  'Dr. Mei Chen', 'DOCTOR', 'Y');

-- Departments
INSERT INTO departments (department_id, name, code, floor_number, phone_ext)
VALUES (seq_departments.NEXTVAL, 'Internal Medicine', 'IM', 2, '2100');
INSERT INTO departments (department_id, name, code, floor_number, phone_ext)
VALUES (seq_departments.NEXTVAL, 'Cardiology', 'CARD', 3, '3100');
INSERT INTO departments (department_id, name, code, floor_number, phone_ext)
VALUES (seq_departments.NEXTVAL, 'Pediatrics', 'PED', 1, '1100');
INSERT INTO departments (department_id, name, code, floor_number, phone_ext)
VALUES (seq_departments.NEXTVAL, 'Emergency', 'ER', 0, '0100');
INSERT INTO departments (department_id, name, code, floor_number, phone_ext)
VALUES (seq_departments.NEXTVAL, 'Orthopedics', 'ORTH', 4, '4100');

-- Doctors
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 1, 'EMP-1001', 'Mei', 'Chen', 'General Internal Medicine',
  'm.chen@hospital.local', '555-0101');
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 2, 'EMP-1002', 'James', 'Okoro', 'Interventional Cardiology',
  'j.okoro@hospital.local', '555-0102');
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 3, 'EMP-1003', 'Sara', 'Nguyen', 'Pediatric Care',
  's.nguyen@hospital.local', '555-0103');
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 4, 'EMP-1004', 'Luis', 'Martinez', 'Emergency Medicine',
  'l.martinez@hospital.local', '555-0104');
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 5, 'EMP-1005', 'Aisha', 'Patel', 'Sports Orthopedics',
  'a.patel@hospital.local', '555-0105');
INSERT INTO doctors (doctor_id, department_id, employee_no, first_name, last_name, specialty, email, phone)
VALUES (seq_doctors.NEXTVAL, 2, 'EMP-1006', 'Helen', 'Wright', 'Heart Failure',
  'h.wright@hospital.local', '555-0106');

-- Patients
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0001', 'Alice', 'Johnson', DATE '1985-03-12', 'F',
  '555-1001', 'alice.j@example.com', 'Springfield', 'A+', 2);
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0002', 'Robert', 'Kim', DATE '1972-11-05', 'M',
  '555-1002', 'r.kim@example.com', 'Springfield', 'O+', 2);
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0003', 'Elena', 'Garcia', DATE '2015-07-22', 'F',
  '555-1003', NULL, 'Riverside', 'B+', 2);
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0004', 'Marcus', 'Brown', DATE '1990-01-30', 'M',
  '555-1004', 'm.brown@example.com', 'Springfield', 'AB-', 2);
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0005', 'Priya', 'Sharma', DATE '1968-09-18', 'F',
  '555-1005', 'p.sharma@example.com', 'Oakdale', 'A-', 2);
INSERT INTO patients (patient_id, mrn, first_name, last_name, date_of_birth, gender, phone, email, city, blood_type, created_by)
VALUES (seq_patients.NEXTVAL, 'MRN-2024-0006', 'Tom', 'Williams', DATE '2001-04-09', 'M',
  '555-1006', 't.williams@example.com', 'Springfield', 'O-', 2);

-- Appointments (relative to SYSDATE for lab freshness)
INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 1, 1,
  TRUNC(SYSDATE) + 1 + INTERVAL '9' HOUR, 30, 'SCHEDULED', 'Annual checkup', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 2, 2,
  TRUNC(SYSDATE) + 1 + INTERVAL '10' HOUR + INTERVAL '30' MINUTE, 45, 'SCHEDULED',
  'Chest pain follow-up', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 3, 3,
  TRUNC(SYSDATE) + INTERVAL '14' HOUR, 30, 'CHECKED_IN', 'Vaccination', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 4, 5,
  TRUNC(SYSDATE) - 2 + INTERVAL '11' HOUR, 30, 'COMPLETED', 'Knee assessment', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 5, 2,
  TRUNC(SYSDATE) + 3 + INTERVAL '15' HOUR, 30, 'SCHEDULED', 'ECG review', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 6, 4,
  TRUNC(SYSDATE) - 1 + INTERVAL '20' HOUR, 20, 'NO_SHOW', 'Urgent consult', 2);

INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, created_by)
VALUES (seq_appointments.NEXTVAL, 1, 6,
  TRUNC(SYSDATE) + 5 + INTERVAL '9' HOUR + INTERVAL '30' MINUTE, 30, 'SCHEDULED',
  'Cardiology referral', 2);

COMMIT;
