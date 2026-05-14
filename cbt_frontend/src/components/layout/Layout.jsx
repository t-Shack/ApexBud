import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        padding: '2rem',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
