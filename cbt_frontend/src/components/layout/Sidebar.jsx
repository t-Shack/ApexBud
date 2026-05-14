import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = {
  admin: [
    { to: '/admin',           label: 'Dashboard',  icon: '▦' },
    { to: '/admin/students',  label: 'Students',   icon: '👤' },
    { to: '/admin/teachers',  label: 'Teachers',   icon: '🎓' },
    { to: '/admin/classes',   label: 'Classes',    icon: '🏫' },
    { to: '/admin/subjects',  label: 'Subjects',   icon: '📚' },
    { to: '/admin/exams',     label: 'Exams',      icon: '📝' },
    { to: '/admin/results',   label: 'Results',    icon: '📊' },
  ],
  teacher: [
    { to: '/teacher',           label: 'Dashboard',  icon: '▦' },
    { to: '/teacher/questions', label: 'Questions',  icon: '❓' },
    { to: '/teacher/exams',     label: 'Exams',      icon: '📝' },
    { to: '/teacher/results',   label: 'Results',    icon: '📊' },
  ],
  student: [
    { to: '/student', label: 'My Exams', icon: '📝' },
  ],
}

const ROLE_LABEL = { admin: 'Admin', teacher: 'Teacher', student: 'Student' }
const ROLE_COLOR = { admin: 'badge-brand', teacher: 'badge-green', student: 'badge-amber' }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', letterSpacing: '-.01em' }}>
          CBT Platform
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(59,91,219,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: '#a5b4fc',
          }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>
              {user?.first_name} {user?.last_name}
            </div>
            <span className={`badge ${ROLE_COLOR[user?.role]}`} style={{ fontSize: 10, padding: '1px 7px' }}>
              {ROLE_LABEL[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem .75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/teacher' || to === '/student'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: 500,
              color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
              background: isActive ? 'rgba(59,91,219,.45)' : 'transparent',
              transition: 'all .15s',
            })}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '.75rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: 'transparent', color: 'rgba(255,255,255,.45)',
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all .15s',
          }}
          onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,.06)'}
          onMouseOut={e => e.currentTarget.style.background='transparent'}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  )
}
