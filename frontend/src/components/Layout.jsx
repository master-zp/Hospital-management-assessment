import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-name">Harbor Clinic</div>
          <div className="brand-sub">Hospital Management System</div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/patients">Patients</NavLink>
          <NavLink to="/appointments">Appointments</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
        </nav>
        <div className="user-chip">
          <span>
            {user?.fullName} · {user?.role}
          </span>
          <button type="button" className="btn secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="fade-in">
        <Outlet />
      </main>
    </div>
  );
}
