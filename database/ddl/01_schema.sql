-- Hospital Management System — Oracle DDL
-- Compatible with Oracle Database 19c / 21c XE
-- Run as HMS_APP (or SYSTEM for demo; prefer dedicated schema)

-- ---------------------------------------------------------------------------
-- Drop (idempotent re-run for assessment labs)
-- ---------------------------------------------------------------------------
BEGIN
  FOR t IN (
    SELECT table_name FROM user_tables
    WHERE table_name IN (
      'APPOINTMENTS','PATIENTS','DOCTORS','DEPARTMENTS','USERS','AUDIT_LOG'
    )
  ) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
  END LOOP;
END;
/
BEGIN
  FOR s IN (
    SELECT sequence_name FROM user_sequences
    WHERE sequence_name IN (
      'SEQ_USERS','SEQ_DEPARTMENTS','SEQ_DOCTORS','SEQ_PATIENTS','SEQ_APPOINTMENTS','SEQ_AUDIT_LOG'
    )
  ) LOOP
    EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
  END LOOP;
END;
/

-- ---------------------------------------------------------------------------
-- Sequences
-- ---------------------------------------------------------------------------
CREATE SEQUENCE seq_users        START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_departments  START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_doctors      START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_patients     START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_appointments START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE seq_audit_log    START WITH 1 INCREMENT BY 1 NOCACHE;

-- ---------------------------------------------------------------------------
-- USERS (basic auth — assessment-appropriate, bcrypt hashes stored in app)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  user_id       NUMBER        NOT NULL,
  username      VARCHAR2(50)  NOT NULL,
  password_hash VARCHAR2(100) NOT NULL,
  full_name     VARCHAR2(120) NOT NULL,
  role          VARCHAR2(20)  DEFAULT 'STAFF' NOT NULL,
  is_active     CHAR(1)       DEFAULT 'Y' NOT NULL,
  created_at    TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_users PRIMARY KEY (user_id),
  CONSTRAINT uq_users_username UNIQUE (username),
  CONSTRAINT ck_users_role CHECK (role IN ('ADMIN','STAFF','DOCTOR')),
  CONSTRAINT ck_users_active CHECK (is_active IN ('Y','N'))
);

-- ---------------------------------------------------------------------------
-- DEPARTMENTS
-- ---------------------------------------------------------------------------
CREATE TABLE departments (
  department_id NUMBER        NOT NULL,
  name          VARCHAR2(100) NOT NULL,
  code          VARCHAR2(10)  NOT NULL,
  floor_number  NUMBER(2),
  phone_ext     VARCHAR2(10),
  is_active     CHAR(1)       DEFAULT 'Y' NOT NULL,
  CONSTRAINT pk_departments PRIMARY KEY (department_id),
  CONSTRAINT uq_departments_code UNIQUE (code),
  CONSTRAINT uq_departments_name UNIQUE (name),
  CONSTRAINT ck_departments_active CHECK (is_active IN ('Y','N'))
);

-- ---------------------------------------------------------------------------
-- DOCTORS
-- ---------------------------------------------------------------------------
CREATE TABLE doctors (
  doctor_id     NUMBER        NOT NULL,
  department_id NUMBER        NOT NULL,
  employee_no   VARCHAR2(20)  NOT NULL,
  first_name    VARCHAR2(60)  NOT NULL,
  last_name     VARCHAR2(60)  NOT NULL,
  specialty     VARCHAR2(100),
  email         VARCHAR2(120),
  phone         VARCHAR2(20),
  is_active     CHAR(1)       DEFAULT 'Y' NOT NULL,
  hired_on      DATE          DEFAULT TRUNC(SYSDATE) NOT NULL,
  CONSTRAINT pk_doctors PRIMARY KEY (doctor_id),
  CONSTRAINT uq_doctors_employee_no UNIQUE (employee_no),
  CONSTRAINT fk_doctors_department FOREIGN KEY (department_id)
    REFERENCES departments (department_id),
  CONSTRAINT ck_doctors_active CHECK (is_active IN ('Y','N'))
);

CREATE INDEX ix_doctors_department ON doctors (department_id);
CREATE INDEX ix_doctors_name ON doctors (last_name, first_name);

-- ---------------------------------------------------------------------------
-- PATIENTS
-- ---------------------------------------------------------------------------
CREATE TABLE patients (
  patient_id    NUMBER        NOT NULL,
  mrn           VARCHAR2(20)  NOT NULL,  -- Medical Record Number
  first_name    VARCHAR2(60)  NOT NULL,
  last_name     VARCHAR2(60)  NOT NULL,
  date_of_birth DATE          NOT NULL,
  gender        CHAR(1)       NOT NULL,
  phone         VARCHAR2(20),
  email         VARCHAR2(120),
  address_line  VARCHAR2(200),
  city          VARCHAR2(80),
  blood_type    VARCHAR2(3),
  created_at    TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  created_by    NUMBER,
  CONSTRAINT pk_patients PRIMARY KEY (patient_id),
  CONSTRAINT uq_patients_mrn UNIQUE (mrn),
  CONSTRAINT ck_patients_gender CHECK (gender IN ('M','F','O')),
  CONSTRAINT ck_patients_blood CHECK (
    blood_type IS NULL OR blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')
  ),
  CONSTRAINT fk_patients_created_by FOREIGN KEY (created_by)
    REFERENCES users (user_id)
);

CREATE INDEX ix_patients_name ON patients (last_name, first_name);
CREATE INDEX ix_patients_dob ON patients (date_of_birth);

-- ---------------------------------------------------------------------------
-- APPOINTMENTS
-- ---------------------------------------------------------------------------
CREATE TABLE appointments (
  appointment_id   NUMBER        NOT NULL,
  patient_id       NUMBER        NOT NULL,
  doctor_id        NUMBER        NOT NULL,
  scheduled_at     TIMESTAMP     NOT NULL,
  duration_minutes NUMBER(3)     DEFAULT 30 NOT NULL,
  status           VARCHAR2(20)  DEFAULT 'SCHEDULED' NOT NULL,
  reason           VARCHAR2(500),
  notes            VARCHAR2(1000),
  created_at       TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  created_by       NUMBER,
  CONSTRAINT pk_appointments PRIMARY KEY (appointment_id),
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id)
    REFERENCES patients (patient_id),
  CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id)
    REFERENCES doctors (doctor_id),
  CONSTRAINT fk_appt_created_by FOREIGN KEY (created_by)
    REFERENCES users (user_id),
  CONSTRAINT ck_appt_status CHECK (
    status IN ('SCHEDULED','CHECKED_IN','COMPLETED','CANCELLED','NO_SHOW')
  ),
  CONSTRAINT ck_appt_duration CHECK (duration_minutes BETWEEN 5 AND 240)
);

CREATE INDEX ix_appt_patient ON appointments (patient_id);
CREATE INDEX ix_appt_doctor ON appointments (doctor_id);
CREATE INDEX ix_appt_scheduled ON appointments (scheduled_at);
CREATE INDEX ix_appt_status ON appointments (status);

-- Prevent double-booking same doctor at exact same start time
CREATE UNIQUE INDEX uq_appt_doctor_slot
  ON appointments (doctor_id, scheduled_at);

-- ---------------------------------------------------------------------------
-- AUDIT_LOG (lightweight)
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log (
  audit_id    NUMBER        NOT NULL,
  entity_type VARCHAR2(40)  NOT NULL,
  entity_id   NUMBER        NOT NULL,
  action      VARCHAR2(20)  NOT NULL,
  actor_id    NUMBER,
  detail      VARCHAR2(1000),
  created_at  TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_audit_log PRIMARY KEY (audit_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id)
    REFERENCES users (user_id),
  CONSTRAINT ck_audit_action CHECK (action IN ('INSERT','UPDATE','DELETE','LOGIN','LOGOUT'))
);

CREATE INDEX ix_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX ix_audit_created ON audit_log (created_at);

COMMIT;
