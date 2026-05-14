import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Library, ClipboardList, BarChart2, LogOut, Shield
} from 'lucide-react'

const nav = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/students', icon: GraduationCap,   label: 'Students'   },
  { to: '/admin/teachers', icon: Users,            label: 'Teachers'   },
  { to: '/admin/classes',  icon: BookOpen,         label: 'Classes'    },
  { to: '/admin/subjects', icon: Library,          label: 'Subjects'   },
  { to: '/admin/exams',    icon: ClipboardList,    label: 'Exams'      },
  { to: '/admin/results',  icon: BarChart2,        label: 'Results'    },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside style={{ width: '16rem', background: '#0F172A', display: 'flex', flexDirection: 'column', position: 'fixed', inset: '0 auto 0 0', zIndex: 40 }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2rem', height: '2rem', background: '#F59E0B', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} color="#0F172A" />
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>CBT Admin</div>
              <div style={{ color: '#64748B', fontSize: '0.65rem', marginTop: '2px' }}>Management Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
                fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                transition: 'all .15s',
                background: isActive ? '#F59E0B' : 'transparent',
                color:      isActive ? '#0F172A' : '#94A3B8',
              })}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
            <div style={{ width: '2rem', height: '2rem', background: '#1E293B', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontWeight: 700, fontSize: '0.8rem' }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ color: '#64748B', fontSize: '0.7rem' }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'transparent', border: 'none', color: '#64748B', fontSize: '0.8rem', cursor: 'pointer', transition: 'all .15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
            onMouseOut={e  => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ marginLeft: '16rem', flex: 1, padding: '2rem', maxWidth: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}
