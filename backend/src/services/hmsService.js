const bcrypt = require('bcryptjs');
const { isMockMode, withConnection } = require('../config/db');
const { store, nextId, enrichAppointment } = require('./mockStore');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.USER_ID,
    username: row.USERNAME,
    fullName: row.FULL_NAME,
    role: row.ROLE,
  };
}

function mapPatient(row) {
  return {
    id: row.PATIENT_ID,
    mrn: row.MRN,
    firstName: row.FIRST_NAME,
    lastName: row.LAST_NAME,
    dateOfBirth: row.DATE_OF_BIRTH,
    gender: row.GENDER,
    phone: row.PHONE,
    email: row.EMAIL,
    city: row.CITY,
    bloodType: row.BLOOD_TYPE,
    createdAt: row.CREATED_AT,
  };
}

function mapDoctor(row) {
  return {
    id: row.DOCTOR_ID,
    departmentId: row.DEPARTMENT_ID,
    departmentName: row.DEPARTMENT_NAME ?? null,
    employeeNo: row.EMPLOYEE_NO,
    firstName: row.FIRST_NAME,
    lastName: row.LAST_NAME,
    specialty: row.SPECIALTY,
    email: row.EMAIL,
    phone: row.PHONE,
    isActive: row.IS_ACTIVE === 'Y',
  };
}

function mapDepartment(row) {
  return {
    id: row.DEPARTMENT_ID,
    name: row.NAME,
    code: row.CODE,
    floorNumber: row.FLOOR_NUMBER,
    phoneExt: row.PHONE_EXT,
    isActive: row.IS_ACTIVE === 'Y',
  };
}

function mapAppointment(row) {
  return {
    id: row.APPOINTMENT_ID,
    patientId: row.PATIENT_ID,
    doctorId: row.DOCTOR_ID,
    scheduledAt: row.SCHEDULED_AT,
    durationMinutes: row.DURATION_MINUTES,
    status: row.STATUS,
    reason: row.REASON,
    notes: row.NOTES,
    patientName: row.PATIENT_NAME ?? null,
    patientMrn: row.PATIENT_MRN ?? null,
    doctorName: row.DOCTOR_NAME ?? null,
    departmentName: row.DEPARTMENT_NAME ?? null,
  };
}

async function findUserByUsername(username) {
  if (isMockMode()) {
    return store.users.find(
      (u) => u.USERNAME === username && u.IS_ACTIVE === 'Y'
    ) || null;
  }
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `SELECT user_id, username, password_hash, full_name, role, is_active
       FROM users WHERE username = :username AND is_active = 'Y'`,
      { username }
    );
    return result.rows[0] || null;
  });
}

async function authenticate(username, password) {
  const user = await findUserByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.PASSWORD_HASH);
  if (!ok) return null;
  return mapUser(user);
}

async function listDepartments() {
  if (isMockMode()) {
    return store.departments
      .filter((d) => d.IS_ACTIVE === 'Y')
      .map(mapDepartment);
  }
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `SELECT department_id, name, code, floor_number, phone_ext, is_active
       FROM departments WHERE is_active = 'Y' ORDER BY name`
    );
    return result.rows.map(mapDepartment);
  });
}

async function listDoctors({ departmentId } = {}) {
  if (isMockMode()) {
    let rows = store.doctors.filter((d) => d.IS_ACTIVE === 'Y');
    if (departmentId) {
      rows = rows.filter((d) => d.DEPARTMENT_ID === Number(departmentId));
    }
    return rows.map((d) => {
      const dep = store.departments.find((x) => x.DEPARTMENT_ID === d.DEPARTMENT_ID);
      return mapDoctor({ ...d, DEPARTMENT_NAME: dep?.NAME });
    });
  }
  return withConnection(async (conn) => {
    const binds = {};
    let sql = `
      SELECT d.doctor_id, d.department_id, dep.name AS department_name,
             d.employee_no, d.first_name, d.last_name, d.specialty,
             d.email, d.phone, d.is_active
      FROM doctors d
      JOIN departments dep ON dep.department_id = d.department_id
      WHERE d.is_active = 'Y'`;
    if (departmentId) {
      sql += ` AND d.department_id = :departmentId`;
      binds.departmentId = Number(departmentId);
    }
    sql += ` ORDER BY d.last_name, d.first_name`;
    const result = await conn.execute(sql, binds);
    return result.rows.map(mapDoctor);
  });
}

async function listPatients({ q } = {}) {
  if (isMockMode()) {
    let rows = [...store.patients];
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.MRN.toLowerCase().includes(needle) ||
          p.FIRST_NAME.toLowerCase().includes(needle) ||
          p.LAST_NAME.toLowerCase().includes(needle)
      );
    }
    return rows.map(mapPatient);
  }
  return withConnection(async (conn) => {
    const binds = {};
    let sql = `
      SELECT patient_id, mrn, first_name, last_name, date_of_birth, gender,
             phone, email, city, blood_type, created_at
      FROM patients WHERE 1=1`;
    if (q) {
      sql += ` AND (
        UPPER(mrn) LIKE UPPER(:q) OR
        UPPER(first_name) LIKE UPPER(:q) OR
        UPPER(last_name) LIKE UPPER(:q)
      )`;
      binds.q = `%${q}%`;
    }
    sql += ` ORDER BY last_name, first_name`;
    const result = await conn.execute(sql, binds);
    return result.rows.map(mapPatient);
  });
}

async function getPatient(id) {
  if (isMockMode()) {
    const row = store.patients.find((p) => p.PATIENT_ID === Number(id));
    return row ? mapPatient(row) : null;
  }
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `SELECT patient_id, mrn, first_name, last_name, date_of_birth, gender,
              phone, email, city, blood_type, created_at
       FROM patients WHERE patient_id = :id`,
      { id: Number(id) }
    );
    return result.rows[0] ? mapPatient(result.rows[0]) : null;
  });
}

async function createPatient(data, actorId) {
  if (isMockMode()) {
    const id = nextId('patients');
    const year = new Date().getFullYear();
    const mrn = data.mrn || `MRN-${year}-${String(id).padStart(4, '0')}`;
    const row = {
      PATIENT_ID: id,
      MRN: mrn,
      FIRST_NAME: data.firstName,
      LAST_NAME: data.lastName,
      DATE_OF_BIRTH: data.dateOfBirth,
      GENDER: data.gender,
      PHONE: data.phone || null,
      EMAIL: data.email || null,
      CITY: data.city || null,
      BLOOD_TYPE: data.bloodType || null,
      CREATED_AT: new Date().toISOString(),
      CREATED_BY: actorId,
    };
    store.patients.push(row);
    return mapPatient(row);
  }
  return withConnection(async (conn) => {
    const idResult = await conn.execute(`SELECT seq_patients.NEXTVAL AS id FROM dual`);
    const id = idResult.rows[0].ID;
    const year = new Date().getFullYear();
    const mrn = data.mrn || `MRN-${year}-${String(id).padStart(4, '0')}`;
    await conn.execute(
      `INSERT INTO patients (
         patient_id, mrn, first_name, last_name, date_of_birth, gender,
         phone, email, city, blood_type, created_by
       ) VALUES (
         :id, :mrn, :firstName, :lastName, TO_DATE(:dob, 'YYYY-MM-DD'), :gender,
         :phone, :email, :city, :bloodType, :actorId
       )`,
      {
        id,
        mrn,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone || null,
        email: data.email || null,
        city: data.city || null,
        bloodType: data.bloodType || null,
        actorId: actorId || null,
      }
    );
    return getPatient(id);
  });
}

async function listAppointments({ status, doctorId, from, to } = {}) {
  if (isMockMode()) {
    let rows = store.appointments.map(enrichAppointment);
    if (status) rows = rows.filter((a) => a.STATUS === status);
    if (doctorId) rows = rows.filter((a) => a.DOCTOR_ID === Number(doctorId));
    if (from) rows = rows.filter((a) => new Date(a.SCHEDULED_AT) >= new Date(from));
    if (to) rows = rows.filter((a) => new Date(a.SCHEDULED_AT) <= new Date(to));
    rows.sort((a, b) => new Date(a.SCHEDULED_AT) - new Date(b.SCHEDULED_AT));
    return rows.map(mapAppointment);
  }
  return withConnection(async (conn) => {
    const result = await conn.execute(
      buildApptSql({ status, doctorId, from, to }),
      buildApptBinds({ status, doctorId, from, to })
    );
    return result.rows.map(mapAppointment);
  });
}

function buildApptSql({ status, doctorId, from, to }) {
  let sql = `
    SELECT a.appointment_id, a.patient_id, a.doctor_id, a.scheduled_at,
           a.duration_minutes, a.status, a.reason, a.notes,
           p.first_name || ' ' || p.last_name AS patient_name,
           p.mrn AS patient_mrn,
           d.first_name || ' ' || d.last_name AS doctor_name,
           dep.name AS department_name
    FROM appointments a
    JOIN patients p ON p.patient_id = a.patient_id
    JOIN doctors d ON d.doctor_id = a.doctor_id
    JOIN departments dep ON dep.department_id = d.department_id
    WHERE 1=1`;
  if (status) sql += ` AND a.status = :status`;
  if (doctorId) sql += ` AND a.doctor_id = :doctorId`;
  if (from) sql += ` AND a.scheduled_at >= :fromTs`;
  if (to) sql += ` AND a.scheduled_at <= :toTs`;
  sql += ` ORDER BY a.scheduled_at`;
  return sql;
}

function buildApptBinds({ status, doctorId, from, to }) {
  const binds = {};
  if (status) binds.status = status;
  if (doctorId) binds.doctorId = Number(doctorId);
  if (from) binds.fromTs = new Date(from);
  if (to) binds.toTs = new Date(to);
  return binds;
}

async function createAppointment(data, actorId) {
  if (isMockMode()) {
    const clash = store.appointments.find(
      (a) =>
        a.DOCTOR_ID === Number(data.doctorId) &&
        a.SCHEDULED_AT === new Date(data.scheduledAt).toISOString() &&
        a.STATUS !== 'CANCELLED'
    );
    if (clash) {
      const err = new Error('Doctor already booked at this time');
      err.status = 409;
      throw err;
    }
    const id = nextId('appointments');
    const row = {
      APPOINTMENT_ID: id,
      PATIENT_ID: Number(data.patientId),
      DOCTOR_ID: Number(data.doctorId),
      SCHEDULED_AT: new Date(data.scheduledAt).toISOString(),
      DURATION_MINUTES: data.durationMinutes || 30,
      STATUS: 'SCHEDULED',
      REASON: data.reason || null,
      NOTES: data.notes || null,
      CREATED_BY: actorId,
    };
    store.appointments.push(row);
    return mapAppointment(enrichAppointment(row));
  }
  return withConnection(async (conn) => {
    try {
      const idResult = await conn.execute(`SELECT seq_appointments.NEXTVAL AS id FROM dual`);
      const id = idResult.rows[0].ID;
      await conn.execute(
        `INSERT INTO appointments (
           appointment_id, patient_id, doctor_id, scheduled_at,
           duration_minutes, status, reason, notes, created_by
         ) VALUES (
           :id, :patientId, :doctorId, :scheduledAt,
           :duration, 'SCHEDULED', :reason, :notes, :actorId
         )`,
        {
          id,
          patientId: Number(data.patientId),
          doctorId: Number(data.doctorId),
          scheduledAt: new Date(data.scheduledAt),
          duration: data.durationMinutes || 30,
          reason: data.reason || null,
          notes: data.notes || null,
          actorId: actorId || null,
        }
      );
      const list = await listAppointments({});
      return list.find((a) => a.id === id);
    } catch (e) {
      if (e.errorNum === 1) {
        const err = new Error('Doctor already booked at this time');
        err.status = 409;
        throw err;
      }
      throw e;
    }
  });
}

async function updateAppointmentStatus(id, status) {
  const allowed = ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  if (!allowed.includes(status)) {
    const err = new Error(`Invalid status. Allowed: ${allowed.join(', ')}`);
    err.status = 400;
    throw err;
  }
  if (isMockMode()) {
    const row = store.appointments.find((a) => a.APPOINTMENT_ID === Number(id));
    if (!row) return null;
    row.STATUS = status;
    return mapAppointment(enrichAppointment(row));
  }
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `UPDATE appointments SET status = :status WHERE appointment_id = :id`,
      { status, id: Number(id) }
    );
    if (result.rowsAffected === 0) return null;
    const list = await listAppointments({});
    return list.find((a) => a.id === Number(id));
  });
}

module.exports = {
  authenticate,
  mapUser,
  listDepartments,
  listDoctors,
  listPatients,
  getPatient,
  createPatient,
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
};
