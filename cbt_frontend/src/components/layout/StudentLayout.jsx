import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, GraduationCap } from 'lucide-react'

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '0 2rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '2rem', height: '2rem', background: '#0F172A', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem' }}>CBT Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{user?.first_name} {user?.last_name}</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Student</div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ gap: '0.375rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
