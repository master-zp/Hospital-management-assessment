/**
 * In-memory HMS data for local exploration when Oracle is unavailable.
 * Mirrors seed SQL shape so the React UI behaves the same.
 */

const bcrypt = require('bcryptjs');

// Precomputed bcrypt for Password123! (cost 10) — regenerated at boot if needed
const DEFAULT_HASH = bcrypt.hashSync('Password123!', 10);

const now = new Date();
const day = (offset, hour = 9, minute = 0) => {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const store = {
  users: [
    { USER_ID: 1, USERNAME: 'admin', PASSWORD_HASH: DEFAULT_HASH, FULL_NAME: 'System Administrator', ROLE: 'ADMIN', IS_ACTIVE: 'Y' },
    { USER_ID: 2, USERNAME: 'reception', PASSWORD_HASH: DEFAULT_HASH, FULL_NAME: 'Front Desk Staff', ROLE: 'STAFF', IS_ACTIVE: 'Y' },
    { USER_ID: 3, USERNAME: 'drchen', PASSWORD_HASH: DEFAULT_HASH, FULL_NAME: 'Dr. Mei Chen', ROLE: 'DOCTOR', IS_ACTIVE: 'Y' },
  ],
  departments: [
    { DEPARTMENT_ID: 1, NAME: 'Internal Medicine', CODE: 'IM', FLOOR_NUMBER: 2, PHONE_EXT: '2100', IS_ACTIVE: 'Y' },
    { DEPARTMENT_ID: 2, NAME: 'Cardiology', CODE: 'CARD', FLOOR_NUMBER: 3, PHONE_EXT: '3100', IS_ACTIVE: 'Y' },
    { DEPARTMENT_ID: 3, NAME: 'Pediatrics', CODE: 'PED', FLOOR_NUMBER: 1, PHONE_EXT: '1100', IS_ACTIVE: 'Y' },
    { DEPARTMENT_ID: 4, NAME: 'Emergency', CODE: 'ER', FLOOR_NUMBER: 0, PHONE_EXT: '0100', IS_ACTIVE: 'Y' },
    { DEPARTMENT_ID: 5, NAME: 'Orthopedics', CODE: 'ORTH', FLOOR_NUMBER: 4, PHONE_EXT: '4100', IS_ACTIVE: 'Y' },
  ],
  doctors: [
    { DOCTOR_ID: 1, DEPARTMENT_ID: 1, EMPLOYEE_NO: 'EMP-1001', FIRST_NAME: 'Mei', LAST_NAME: 'Chen', SPECIALTY: 'General Internal Medicine', EMAIL: 'm.chen@hospital.local', PHONE: '555-0101', IS_ACTIVE: 'Y' },
    { DOCTOR_ID: 2, DEPARTMENT_ID: 2, EMPLOYEE_NO: 'EMP-1002', FIRST_NAME: 'James', LAST_NAME: 'Okoro', SPECIALTY: 'Interventional Cardiology', EMAIL: 'j.okoro@hospital.local', PHONE: '555-0102', IS_ACTIVE: 'Y' },
    { DOCTOR_ID: 3, DEPARTMENT_ID: 3, EMPLOYEE_NO: 'EMP-1003', FIRST_NAME: 'Sara', LAST_NAME: 'Nguyen', SPECIALTY: 'Pediatric Care', EMAIL: 's.nguyen@hospital.local', PHONE: '555-0103', IS_ACTIVE: 'Y' },
    { DOCTOR_ID: 4, DEPARTMENT_ID: 4, EMPLOYEE_NO: 'EMP-1004', FIRST_NAME: 'Luis', LAST_NAME: 'Martinez', SPECIALTY: 'Emergency Medicine', EMAIL: 'l.martinez@hospital.local', PHONE: '555-0104', IS_ACTIVE: 'Y' },
    { DOCTOR_ID: 5, DEPARTMENT_ID: 5, EMPLOYEE_NO: 'EMP-1005', FIRST_NAME: 'Aisha', LAST_NAME: 'Patel', SPECIALTY: 'Sports Orthopedics', EMAIL: 'a.patel@hospital.local', PHONE: '555-0105', IS_ACTIVE: 'Y' },
    { DOCTOR_ID: 6, DEPARTMENT_ID: 2, EMPLOYEE_NO: 'EMP-1006', FIRST_NAME: 'Helen', LAST_NAME: 'Wright', SPECIALTY: 'Heart Failure', EMAIL: 'h.wright@hospital.local', PHONE: '555-0106', IS_ACTIVE: 'Y' },
  ],
  patients: [
    { PATIENT_ID: 1, MRN: 'MRN-2024-0001', FIRST_NAME: 'Alice', LAST_NAME: 'Johnson', DATE_OF_BIRTH: '1985-03-12', GENDER: 'F', PHONE: '555-1001', EMAIL: 'alice.j@example.com', CITY: 'Springfield', BLOOD_TYPE: 'A+', CREATED_AT: day(-30) },
    { PATIENT_ID: 2, MRN: 'MRN-2024-0002', FIRST_NAME: 'Robert', LAST_NAME: 'Kim', DATE_OF_BIRTH: '1972-11-05', GENDER: 'M', PHONE: '555-1002', EMAIL: 'r.kim@example.com', CITY: 'Springfield', BLOOD_TYPE: 'O+', CREATED_AT: day(-28) },
    { PATIENT_ID: 3, MRN: 'MRN-2024-0003', FIRST_NAME: 'Elena', LAST_NAME: 'Garcia', DATE_OF_BIRTH: '2015-07-22', GENDER: 'F', PHONE: '555-1003', EMAIL: null, CITY: 'Riverside', BLOOD_TYPE: 'B+', CREATED_AT: day(-20) },
    { PATIENT_ID: 4, MRN: 'MRN-2024-0004', FIRST_NAME: 'Marcus', LAST_NAME: 'Brown', DATE_OF_BIRTH: '1990-01-30', GENDER: 'M', PHONE: '555-1004', EMAIL: 'm.brown@example.com', CITY: 'Springfield', BLOOD_TYPE: 'AB-', CREATED_AT: day(-15) },
    { PATIENT_ID: 5, MRN: 'MRN-2024-0005', FIRST_NAME: 'Priya', LAST_NAME: 'Sharma', DATE_OF_BIRTH: '1968-09-18', GENDER: 'F', PHONE: '555-1005', EMAIL: 'p.sharma@example.com', CITY: 'Oakdale', BLOOD_TYPE: 'A-', CREATED_AT: day(-10) },
    { PATIENT_ID: 6, MRN: 'MRN-2024-0006', FIRST_NAME: 'Tom', LAST_NAME: 'Williams', DATE_OF_BIRTH: '2001-04-09', GENDER: 'M', PHONE: '555-1006', EMAIL: 't.williams@example.com', CITY: 'Springfield', BLOOD_TYPE: 'O-', CREATED_AT: day(-5) },
  ],
  appointments: [
    { APPOINTMENT_ID: 1, PATIENT_ID: 1, DOCTOR_ID: 1, SCHEDULED_AT: day(1, 9, 0), DURATION_MINUTES: 30, STATUS: 'SCHEDULED', REASON: 'Annual checkup', NOTES: null },
    { APPOINTMENT_ID: 2, PATIENT_ID: 2, DOCTOR_ID: 2, SCHEDULED_AT: day(1, 10, 30), DURATION_MINUTES: 45, STATUS: 'SCHEDULED', REASON: 'Chest pain follow-up', NOTES: null },
    { APPOINTMENT_ID: 3, PATIENT_ID: 3, DOCTOR_ID: 3, SCHEDULED_AT: day(0, 14, 0), DURATION_MINUTES: 30, STATUS: 'CHECKED_IN', REASON: 'Vaccination', NOTES: null },
    { APPOINTMENT_ID: 4, PATIENT_ID: 4, DOCTOR_ID: 5, SCHEDULED_AT: day(-2, 11, 0), DURATION_MINUTES: 30, STATUS: 'COMPLETED', REASON: 'Knee assessment', NOTES: 'Follow up in 6 weeks' },
    { APPOINTMENT_ID: 5, PATIENT_ID: 5, DOCTOR_ID: 2, SCHEDULED_AT: day(3, 15, 0), DURATION_MINUTES: 30, STATUS: 'SCHEDULED', REASON: 'ECG review', NOTES: null },
    { APPOINTMENT_ID: 6, PATIENT_ID: 6, DOCTOR_ID: 4, SCHEDULED_AT: day(-1, 20, 0), DURATION_MINUTES: 20, STATUS: 'NO_SHOW', REASON: 'Urgent consult', NOTES: null },
    { APPOINTMENT_ID: 7, PATIENT_ID: 1, DOCTOR_ID: 6, SCHEDULED_AT: day(5, 9, 30), DURATION_MINUTES: 30, STATUS: 'SCHEDULED', REASON: 'Cardiology referral', NOTES: null },
  ],
  seq: { users: 3, departments: 5, doctors: 6, patients: 6, appointments: 7 },
};

function nextId(key) {
  store.seq[key] += 1;
  return store.seq[key];
}

function enrichAppointment(a) {
  const patient = store.patients.find((p) => p.PATIENT_ID === a.PATIENT_ID);
  const doctor = store.doctors.find((d) => d.DOCTOR_ID === a.DOCTOR_ID);
  const dept = doctor
    ? store.departments.find((dep) => dep.DEPARTMENT_ID === doctor.DEPARTMENT_ID)
    : null;
  return {
    ...a,
    PATIENT_NAME: patient ? `${patient.FIRST_NAME} ${patient.LAST_NAME}` : null,
    PATIENT_MRN: patient?.MRN ?? null,
    DOCTOR_NAME: doctor ? `${doctor.FIRST_NAME} ${doctor.LAST_NAME}` : null,
    DEPARTMENT_NAME: dept?.NAME ?? null,
  };
}

module.exports = { store, nextId, enrichAppointment, DEFAULT_HASH };
