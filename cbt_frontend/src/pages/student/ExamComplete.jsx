import { useNavigate } from 'react-router-dom'
import { CheckCircle, Home } from 'lucide-react'

export default function ExamComplete() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ width: '5rem', height: '5rem', background: '#ECFDF5', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <CheckCircle size={40} color="#059669" />
      </div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Exam Submitted!</h1>
      <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.6, marginBottom: '2rem' }}>
        Your answers have been recorded and marked. Your teacher will review and publish your final result soon.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/student')}>
        <Home size={15} /> Back to Dashboard
      </button>
    </div>
  )
}
