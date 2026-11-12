import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState('');

  async function load(depId = departmentId) {
    setError('');
    try {
      const qs = depId ? `?departmentId=${encodeURIComponent(depId)}` : '';
      const data = await api(`/doctors${qs}`);
      setDoctors(data.doctors);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    Promise.all([api('/doctors'), api('/departments')])
      .then(([docRes, depRes]) => {
        setDoctors(docRes.doctors);
        setDepartments(depRes.departments);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Doctors &amp; departments</h1>
      <p className="lede">Browse active clinicians filtered by department.</p>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                load(e.target.value);
              }}
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
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
                <th>Employee #</th>
                <th>Name</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>{d.employeeNo}</td>
                  <td>
                    {d.lastName}, {d.firstName}
                  </td>
                  <td>{d.specialty || '—'}</td>
                  <td>{d.departmentName}</td>
                  <td>
                    <div>{d.phone || '—'}</div>
                    <div className="muted">{d.email || ''}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Departments</h2>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Floor</th>
                <th>Ext</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id}>
                  <td>{d.code}</td>
                  <td>{d.name}</td>
                  <td>{d.floorNumber}</td>
                  <td>{d.phoneExt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
