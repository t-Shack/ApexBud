import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, BookOpen, Play } from 'lucide-react'
import { getExams } from '../../api/exams'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exams,   setExams]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExams().then(r => setExams(r.data?.results ?? r.data ?? [])).finally(() => setLoading(false))
  }, [])

  const active = exams.filter(e => e.status === 'active')

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Hello, {user?.first_name} 👋</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {active.length > 0 ? `You have ${active.length} active exam${active.length > 1 ? 's' : ''} available.` : 'No active exams at the moment.'}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner /></div>
      ) : active.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <ClipboardList size={40} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600, color: '#64748B', marginBottom: '0.375rem' }}>No exams available</p>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Check back later or contact your teacher.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {active.map(exam => (
            <div key={exam.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ width: '3rem', height: '3rem', background: '#EFF6FF', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={20} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '0.375rem' }}>{exam.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={13} /> {exam.subject_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {exam.duration_minutes} min</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ClipboardList size={13} /> {exam.question_count} questions</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ flexShrink: 0, gap: '0.5rem' }} onClick={() => navigate(`/student/exam/${exam.id}`)}>
                <Play size={15} /> Start Exam
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
