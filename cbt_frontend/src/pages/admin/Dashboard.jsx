import { useState, useEffect } from 'react'
import { Users, GraduationCap, ClipboardList, BarChart2 } from 'lucide-react'
import { getStudents, getTeachers } from '../../api/accounts'
import { getExams }    from '../../api/exams'
import { getScores }   from '../../api/results'

const StatCard = ({ icon: Icon, label, value, bg, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: bg }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, marginTop: '2px' }}>{value ?? '—'}</p>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    Promise.allSettled([getStudents(), getTeachers(), getExams(), getScores()]).then(([s, t, e, r]) => {
      setStats({
        students: s.value?.data?.count ?? s.value?.data?.length ?? 0,
        teachers: t.value?.data?.count ?? t.value?.data?.length ?? 0,
        exams:    e.value?.data?.count ?? e.value?.data?.length ?? 0,
        results:  r.value?.data?.count ?? r.value?.data?.length ?? 0,
      })
    })
  }, [])

  const quick = [
    { label: 'Add Student',  href: '/admin/students', bg: '#EFF6FF', color: '#2563EB' },
    { label: 'Add Teacher',  href: '/admin/teachers', bg: '#ECFDF5', color: '#059669' },
    { label: 'Create Exam',  href: '/admin/exams',    bg: '#FFFBEB', color: '#D97706' },
    { label: 'Add Class',    href: '/admin/classes',  bg: '#F0FDF4', color: '#16A34A' },
    { label: 'Add Subject',  href: '/admin/subjects', bg: '#FDF4FF', color: '#9333EA' },
    { label: 'View Results', href: '/admin/results',  bg: '#FFF7ED', color: '#EA580C' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Overview of your CBT platform</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={GraduationCap} label="Students" value={stats.students} bg="#EFF6FF" color="#2563EB" />
        <StatCard icon={Users}         label="Teachers" value={stats.teachers} bg="#ECFDF5" color="#059669" />
        <StatCard icon={ClipboardList} label="Exams"    value={stats.exams}    bg="#FFFBEB" color="#D97706" />
        <StatCard icon={BarChart2}     label="Results"  value={stats.results}  bg="#FDF4FF" color="#9333EA" />
      </div>

      <div className="card">
        <div className="card-header">
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Quick Actions</span>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.875rem' }}>
          {quick.map(({ label, href, bg, color }) => (
            <a key={href} href={href} style={{ padding: '1rem', borderRadius: '0.75rem', background: bg, color, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'block', transition: 'opacity .15s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '.75'}
              onMouseOut={e  => e.currentTarget.style.opacity = '1'}>
              {label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
