import { useEffect, useState } from 'react';
import { api } from '../api/client';

const STATUSES = ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    scheduledAt: '',
    durationMinutes: 30,
    reason: '',
  });

  async function load(status = statusFilter) {
    setError('');
    try {
      const qs = status ? `?status=${encodeURIComponent(status)}` : '';
      const data = await api(`/appointments${qs}`);
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    Promise.all([api('/appointments'), api('/patients'), api('/doctors')])
      .then(([a, p, d]) => {
        setAppointments(a.appointments);
        setPatients(p.patients);
        setDoctors(d.doctors);
        if (p.patients[0]) {
          setForm((f) => ({ ...f, patientId: String(p.patients[0].id) }));
        }
        if (d.doctors[0]) {
          setForm((f) => ({ ...f, doctorId: String(d.doctors[0].id) }));
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const scheduledAt = new Date(form.scheduledAt).toISOString();
      await api('/appointments', {
        method: 'POST',
        body: {
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          scheduledAt,
          durationMinutes: Number(form.durationMinutes),
          reason: form.reason,
        },
      });
      setForm((f) => ({ ...f, reason: '', scheduledAt: '' }));
      await load(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  }

  async function setStatus(id, status) {
    setError('');
    try {
      await api(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: { status },
      });
      await load(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Appointments</h1>
      <p className="lede">Schedule visits and update check-in status on the floor.</p>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="statusFilter">Status filter</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                load(e.target.value);
              }}
            >
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error ? <div className="error">{error}</div> : null}
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>When</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Dept</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7}>No appointments.</td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.scheduledAt).toLocaleString()}</td>
                    <td>
                      {a.patientName}
                      <div className="muted">{a.patientMrn}</div>
                    </td>
                    <td>{a.doctorName}</td>
                    <td>{a.departmentName}</td>
                    <td>{a.reason || '—'}</td>
                    <td>
                      <span className={`badge ${a.status}`}>{a.status}</span>
                    </td>
                    <td>
                      <select
                        aria-label={`Update status for appointment ${a.id}`}
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Book appointment</h2>
        <form onSubmit={onCreate}>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="patientId">Patient</label>
              <select
                id="patientId"
                required
                value={form.patientId}
                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.lastName}, {p.firstName} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="doctorId">Doctor</label>
              <select
                id="doctorId"
                required
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.lastName}, {d.firstName} — {d.specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="scheduledAt">Scheduled at</label>
              <input
                id="scheduledAt"
                type="datetime-local"
                required
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                id="duration"
                type="number"
                min={5}
                max={240}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="reason">Reason</label>
              <input
                id="reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
          </div>
          <div className="toolbar" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <button className="btn" type="submit">
              Book
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
