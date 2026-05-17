import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { startExam, submitExam } from '../../api/results'
import Spinner from '../../components/common/Spinner'

export default function ExamRoom() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [session,   setSession]   = useState(null)
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})   // { examQuestionId: optionId }
  const [timeLeft,  setTimeLeft]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [submitting,setSubmitting]= useState(false)
  const [confirm,   setConfirm]   = useState(false)
  const timerRef = useRef(null)

  // Start exam on mount
  useEffect(() => {
    startExam(id).then(data => {
      setSession(data)
      setQuestions(data.questions)
      setTimeLeft(data.duration_minutes * 60)
    }).catch(() => {
      toast.error('Could not start exam.'); navigate('/student')
    }).finally(() => setLoading(false))
    return () => clearInterval(timerRef.current)
  }, [id])

  // Timer
  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) { handleSubmit(true); return }
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  const handleSelect = (questionId, optionId) => {
    setAnswers(a => ({ ...a, [questionId]: optionId }))
  }

  const handleSubmit = useCallback(async (auto = false) => {
    if (!session) return
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const payload = {
        answers: questions.map(q => ({
          question_id:        q.question_id,
          selected_option_id: answers[q.question_id] ?? null,
        }))
      }
      await submitExam(session.session_id, payload)
      if (auto) toast('Time up! Exam auto-submitted.', { icon: '⏱️' })
      else toast.success('Exam submitted!')
      navigate('/student/done')
    } catch {
      toast.error('Submission failed. Try again.')
      setSubmitting(false)
    }
  }, [session, questions, answers, navigate])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <Spinner size={32} />
      <p style={{ color: '#64748B' }}>Loading exam…</p>
    </div>
  )

  const q        = questions[current]
  const answered = Object.keys(answers).length
  const urgent   = timeLeft !== null && timeLeft < 300  // < 5 min

  if (questions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>This exam has no questions yet.</p>
      <p>Please contact your teacher.</p>
    </div>
  )

  return (
    <div>
      {/* Header bar */}
      <div className="card" style={{ padding: '0.875rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '3.5rem', zIndex: 20 }}>
        <div>
          <p style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{session?.exam_title}</p>
          <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{answered}/{questions.length} answered</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.625rem', background: urgent ? '#FEF2F2' : '#F8FAFC' }}>
          <Clock size={16} color={urgent ? '#DC2626' : '#64748B'} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.1rem', color: urgent ? '#DC2626' : '#0F172A', letterSpacing: '0.04em' }}>
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
          <span style={{ width: '2.25rem', height: '2.25rem', background: '#0F172A', color: 'white', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
            {current + 1}
          </span>
          <p style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A', lineHeight: 1.5 }}>{q?.question_text}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q?.options?.map((opt, i) => {
            const selected = answers[q.question_id] === opt.id
            const letter   = ['A','B','C','D'][i]
            return (
              <button key={opt.id} className={selected ? 'option-selected' : 'option-default'}
                onClick={() => handleSelect(q.question_id, opt.id)}>
                <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', border: `2px solid ${selected ? 'rgba(255,255,255,.4)' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, background: selected ? 'rgba(255,255,255,.15)' : 'transparent' }}>
                  {letter}
                </span>
                {opt.option_text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>
          <ChevronLeft size={16} /> Previous
        </button>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '480px' }}>
          {questions.map((qn, i) => (
            <button key={qn.id} onClick={() => setCurrent(i)}
              style={{ width: '2rem', height: '2rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', transition: 'all .15s',
                background: i === current ? '#0F172A' : answers[qn.question_id] ? '#ECFDF5' : '#F1F5F9',
                color:      i === current ? 'white'   : answers[qn.question_id] ? '#059669' : '#94A3B8',
              }}>{i + 1}</button>
          ))}
        </div>
        {current < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn btn-accent" onClick={() => setConfirm(true)}>
            <Send size={15} /> Submit
          </button>
        )}
      </div>

      {/* Submit confirm overlay */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="card" style={{ padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', background: '#FFFBEB', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <AlertTriangle size={24} color="#D97706" />
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Submit Exam?</h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              You have answered <strong style={{ color: '#0F172A' }}>{answered}</strong> of <strong style={{ color: '#0F172A' }}>{questions.length}</strong> questions.
            </p>
            {answered < questions.length && (
              <p style={{ color: '#D97706', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                ⚠ {questions.length - answered} question{questions.length - answered > 1 ? 's' : ''} unanswered — will receive 0 marks.
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setConfirm(false)} disabled={submitting}>Go Back</button>
              <button className="btn btn-accent" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? <Spinner size={16} color="white" /> : <><Send size={15} /> Confirm Submit</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
