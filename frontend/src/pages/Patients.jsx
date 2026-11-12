import { useEffect, useState } from 'react';
import { api } from '../api/client';

const emptyForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'F',
  phone: '',
  email: '',
  city: '',
  bloodType: '',
};

export default function Patients() {
  const [q, setQ] = useState('');
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(search = q) {
    setLoading(true);
    setError('');
    try {
      const data = await api(`/patients${search ? `?q=${encodeURIComponent(search)}` : ''}`);
      setPatients(data.patients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load('');
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onCreate(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api('/patients', { method: 'POST', body: form });
      setForm(emptyForm);
      setMessage('Patient registered.');
      await load(q);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Patients</h1>
      <p className="lede">Search the chart list or register a new patient record.</p>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="search">Search by MRN or name</label>
            <input
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Johnson or MRN-2024"
            />
          </div>
          <button type="button" className="btn secondary" onClick={() => load(q)}>
            Search
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
        {message ? <p className="muted">{message}</p> : null}
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>MRN</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>City</th>
                <th>Blood</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Loading…</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7}>No patients found.</td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.mrn}</td>
                    <td>
                      {p.lastName}, {p.firstName}
                    </td>
                    <td>{String(p.dateOfBirth).slice(0, 10)}</td>
                    <td>{p.gender}</td>
                    <td>{p.phone || '—'}</td>
                    <td>{p.city || '—'}</td>
                    <td>{p.bloodType || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Register patient</h2>
        <form onSubmit={onCreate}>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                required
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                required
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
              >
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="bloodType">Blood type</label>
              <select
                id="bloodType"
                value={form.bloodType}
                onChange={(e) => updateField('bloodType', e.target.value)}
              >
                <option value="">Unknown</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="toolbar" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <button className="btn" type="submit">
              Save patient
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
