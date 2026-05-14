import { useState, useEffect } from 'react'
import { HelpCircle, ClipboardList, BarChart2, Clock } from 'lucide-react'
import { getQuestions } from '../../api/exams'
import { getExams }    from '../../api/exams'
import { getScores }   from '../../api/results'
import { useAuth }     from '../../context/AuthContext'

const StatCard = ({ icon: Icon, label, value, bg, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
    <div>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, marginTop: '2px' }}>{value ?? '—'}</p>
    </div>
  </div>
)

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    Promise.allSettled([getQuestions(), getExams(), getScores()]).then(([q, e, r]) => {
      const exams = e.value?.data?.results ?? e.value?.data ?? []
      setStats({
        questions: q.value?.data?.count ?? q.value?.data?.length ?? 0,
        exams:     exams.length,
        active:    exams.filter(ex => ex.status === 'active').length,
        results:   r.value?.data?.count ?? r.value?.data?.length ?? 0,
      })
    })
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome, {user?.first_name}</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Here's an overview of your teaching activity</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={HelpCircle}   label="Questions"      value={stats.questions} bg="#EFF6FF" color="#2563EB" />
        <StatCard icon={ClipboardList} label="Total Exams"   value={stats.exams}    bg="#ECFDF5" color="#059669" />
        <StatCard icon={Clock}         label="Active Exams"  value={stats.active}   bg="#FFFBEB" color="#D97706" />
        <StatCard icon={BarChart2}     label="Results"       value={stats.results}  bg="#F0FDF4" color="#16A34A" />
      </div>
      <div className="card">
        <div className="card-header"><span style={{ fontWeight: 600 }}>Quick Actions</span></div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
          {[
            { label: 'Create Question', href: '/teacher/questions', bg: '#EFF6FF', color: '#2563EB' },
            { label: 'Create Exam',     href: '/teacher/exams',     bg: '#ECFDF5', color: '#059669' },
            { label: 'View Results',    href: '/teacher/results',   bg: '#FFFBEB', color: '#D97706' },
          ].map(({ label, href, bg, color }) => (
            <a key={href} href={href} style={{ padding: '1rem', borderRadius: '0.75rem', background: bg, color, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', transition: 'opacity .15s', display: 'block' }}
              onMouseOver={e => e.currentTarget.style.opacity = '.75'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
              {label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
