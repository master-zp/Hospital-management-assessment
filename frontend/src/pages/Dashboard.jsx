import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('/appointments'),
      api('/patients'),
      api('/doctors'),
    ])
      .then(([a, p, d]) => {
        setAppointments(a.appointments);
        setPatients(p.patients);
        setDoctors(d.doctors);
      })
      .catch((err) => setError(err.message));
  }, []);

  const today = new Date().toDateString();
  const todayCount = appointments.filter(
    (a) => new Date(a.scheduledAt).toDateString() === today
  ).length;
  const scheduled = appointments.filter((a) => a.status === 'SCHEDULED').length;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="lede">Operational snapshot for today’s clinic floor.</p>
      {error ? <div className="error">{error}</div> : null}
      <div className="stat-row">
        <div className="stat">
          <strong>{todayCount}</strong>
          <span>Appointments today</span>
        </div>
        <div className="stat">
          <strong>{scheduled}</strong>
          <span>Open scheduled visits</span>
        </div>
        <div className="stat">
          <strong>{patients.length}</strong>
          <span>Registered patients</span>
        </div>
      </div>
      <section className="panel">
        <h2>Quick links</h2>
        <p className="muted">
          {doctors.length} active doctors across clinical departments.
        </p>
        <div className="toolbar">
          <Link className="btn" to="/patients">
            Register / search patients
          </Link>
          <Link className="btn secondary" to="/appointments">
            Manage appointments
          </Link>
          <Link className="btn secondary" to="/doctors">
            View doctors
          </Link>
        </div>
      </section>
    </div>
  );
}
