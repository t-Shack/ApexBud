import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getQuestions, createQuestion, deleteQuestion } from '../../api/exams'
import { getSubjects } from '../../api/academics'
import Modal from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

const EMPTY_FORM = {
  subject: '', question_text: '', question_type: 'mcq',
  options: [
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]
}

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState([])
  const [subjects,  setSubjects]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [filter,    setFilter]    = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [q, s] = await Promise.all([getQuestions(), getSubjects()])
      setQuestions(q.data?.results ?? q.data ?? [])
      setSubjects(s.data?.results ?? s.data ?? [])
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const setOption = (i, key, val) => setForm(f => {
    const opts = [...f.options]
    if (key === 'is_correct') {
      opts.forEach((o, idx) => o.is_correct = idx === i)
    } else {
      opts[i] = { ...opts[i], [key]: val }
    }
    return { ...f, options: opts }
  })

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.options.some(o => o.is_correct)) { toast.error('Mark at least one correct answer'); return }
    if (form.options.some(o => !o.option_text.trim())) { toast.error('Fill in all options'); return }
    setSaving(true)
    try {
      await createQuestion(form); toast.success('Question created')
      setModal(false); setForm(EMPTY_FORM); load()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteQuestion(deleting.id); toast.success('Question deleted'); setDeleting(null); load() }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const filtered = questions.filter(q => !filter || q.subject === filter)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Questions</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{questions.length} in question bank</p></div>
        <button className="btn btn-teal" onClick={() => { setForm(EMPTY_FORM); setModal(true) }}><Plus size={16} /> New Question</button>
      </div>

      <div className="card">
        <div className="card-header">
          <select className="field-input" style={{ width: '220px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class_name}</option>)}
          </select>
        </div>
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((q, i) => (
              <div key={q.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F8FAFC', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, color: '#CBD5E1', fontSize: '0.875rem', minWidth: '2rem', marginTop: '2px' }}>#{i+1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: '#0F172A', marginBottom: '0.5rem' }}>{q.question_text}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {q.options?.map(opt => (
                      <span key={opt.id} style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '9999px', background: opt.is_correct ? '#ECFDF5' : '#F1F5F9', color: opt.is_correct ? '#059669' : '#64748B', fontWeight: opt.is_correct ? 600 : 400 }}>
                        {opt.is_correct && '✓ '}{opt.option_text}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleting(q)}><Trash2 size={13} /></button>
              </div>
            ))}
            {!filtered.length && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No questions found</div>}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Question" width="max-w-xl">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            <label className="field-label">Subject</label>
            <select className="field-input" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Question Type</label>
            <select className="field-input" value={form.question_type} onChange={e => {
              const type = e.target.value
              setForm(f => ({ ...f, question_type: type, options: type === 'true_false'
                ? [{ option_text: 'True', is_correct: true }, { option_text: 'False', is_correct: false }]
                : EMPTY_FORM.options
              }))
            }}>
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="true_false">True / False</option>
            </select>
          </div>
          <div>
            <label className="field-label">Question Text</label>
            <textarea className="field-input" required rows={3} style={{ resize: 'vertical' }} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} />
          </div>
          <div>
            <label className="field-label">Options — click circle to mark correct answer</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <button type="button" onClick={() => setOption(i, 'is_correct', true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: opt.is_correct ? '#059669' : '#CBD5E1', flexShrink: 0 }}>
                    {opt.is_correct ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <input className="field-input" placeholder={`Option ${i + 1}`} required={form.question_type !== 'true_false'}
                    readOnly={form.question_type === 'true_false'}
                    value={opt.option_text} onChange={e => setOption(i, 'option_text', e.target.value)} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.375rem' }}>Green circle = correct answer</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-teal" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : 'Save Question'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Delete Question" message="Delete this question? It will be removed from all exams." />
    </div>
  )
}
