import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronRight, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { getExams, createExam, updateExam, deleteExam, getQuestions, getExamQuestions, addExamQuestion } from '../../api/exams'
import { getSubjects, getClasses } from '../../api/academics'
import Modal from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

const STATUS_BADGE = { draft: 'badge-slate', active: 'badge-green', completed: 'badge-amber' }

export default function AdminExams() {
  const [exams,     setExams]     = useState([])
  const [subjects,  setSubjects]  = useState([])
  const [classes,   setClasses]   = useState([])
  const [questions, setQuestions] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [qModal,    setQModal]    = useState(false)
  const [selExam,   setSelExam]   = useState(null)
  const [examQs,    setExamQs]    = useState([])
  const [deleting,  setDeleting]  = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [addQ,      setAddQ]      = useState({ question: '', order: 1, marks: 1 })
  const [form, setForm] = useState({ title: '', subject: '', exam_class: '', duration_minutes: 60, start_time: '', end_time: '' })

  const load = async () => {
    setLoading(true)
    try {
      const [e, s, c] = await Promise.all([getExams(), getSubjects(), getClasses()])
      setExams(e.data?.results ?? e.data ?? [])
      setSubjects(s.data?.results ?? s.data ?? [])
      setClasses(c.data?.results ?? c.data ?? [])
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openQModal = async (exam) => {
    setSelExam(exam)
    const [eq, q] = await Promise.all([getExamQuestions(exam.id), getQuestions({ subject: exam.subject })])
    setExamQs(eq.data ?? [])
    setQuestions(q.data?.results ?? q.data ?? [])
    setAddQ({ question: '', order: (eq.data?.length ?? 0) + 1, marks: 1 })
    setQModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await createExam(form); toast.success('Exam created')
      setModal(false); load()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const handleStatusChange = async (exam, status) => {
    try { await updateExam(exam.id, { status }); toast.success(`Status → ${status}`); load() }
    catch { toast.error('Failed') }
  }

  const handleAddQ = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await addExamQuestion(selExam.id, addQ)
      toast.success('Question added')
      const eq = await getExamQuestions(selExam.id)
      setExamQs(eq.data ?? [])
      setAddQ(q => ({ ...q, question: '', order: q.order + 1 }))
      load()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteExam(deleting.id); toast.success('Exam deleted'); setDeleting(null); load() }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Exams</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{exams.length} exams</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', subject: '', exam_class: '', duration_minutes: 60, start_time: '', end_time: '' }); setModal(true) }}><Plus size={16} /> Create Exam</button>
      </div>

      <div className="card">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <table className="tbl">
            <thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Questions</th><th>Total Marks</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {exams.map(ex => (
                <tr key={ex.id}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{ex.title}</td>
                  <td>{ex.subject_name}</td>
                  <td>{ex.class_name}</td>
                  <td style={{ textAlign: 'center' }}>{ex.question_count}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{ex.total_marks}</td>
                  <td>
                    <select className="badge" style={{ border: 'none', cursor: 'pointer', outline: 'none', background: ex.status === 'active' ? '#ECFDF5' : ex.status === 'completed' ? '#FFFBEB' : '#F1F5F9', color: ex.status === 'active' ? '#059669' : ex.status === 'completed' ? '#D97706' : '#64748B', fontWeight: 600, fontSize: '0.7rem', borderRadius: '9999px', padding: '0.2rem 0.65rem' }}
                      value={ex.status} onChange={e => handleStatusChange(ex, e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openQModal(ex)}><Settings size={13} /> Questions</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleting(ex)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!exams.length && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No exams yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Create exam modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Create Exam">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="field-label">Title</label><input className="field-input" required placeholder="e.g. Maths Mid-Term" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label className="field-label">Subject</label>
              <select className="field-input" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                <option value="">Select</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class_name}</option>)}
              </select>
            </div>
            <div><label className="field-label">Class</label>
              <select className="field-input" required value={form.exam_class} onChange={e => setForm(f => ({ ...f, exam_class: e.target.value }))}>
                <option value="">Select</option>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div><label className="field-label">Duration (minutes)</label><input className="field-input" type="number" min={1} required value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label className="field-label">Start Time</label><input className="field-input" type="datetime-local" required value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} /></div>
            <div><label className="field-label">End Time</label><input className="field-input" type="datetime-local" required value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : 'Create Exam'}</button>
          </div>
        </form>
      </Modal>

      {/* Manage questions modal */}
      <Modal open={qModal} onClose={() => setQModal(false)} title={`Questions — ${selExam?.title}`} width="max-w-2xl">
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {examQs.length} question(s) · Total: {examQs.reduce((a, q) => a + q.marks, 0)} marks
          </div>
          {examQs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {examQs.map((eq, i) => (
                <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', background: '#F8FAFC', borderRadius: '0.5rem', fontSize: '0.825rem' }}>
                  <span style={{ fontWeight: 700, color: '#94A3B8', minWidth: '1.5rem' }}>Q{eq.order}</span>
                  <span style={{ flex: 1, color: '#334155' }}>{eq.question?.question_text?.slice(0, 80)}…</span>
                  <span style={{ fontWeight: 700, color: '#0F172A', background: '#E2E8F0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{eq.marks}pt</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Add Question</div>
          <form onSubmit={handleAddQ} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div><label className="field-label">Question</label>
              <select className="field-input" required value={addQ.question} onChange={e => setAddQ(q => ({ ...q, question: e.target.value }))}>
                <option value="">Select question</option>
                {questions.map(q => <option key={q.id} value={q.id}>{q.question_text.slice(0, 80)}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label className="field-label">Order</label><input className="field-input" type="number" min={1} required value={addQ.order} onChange={e => setAddQ(q => ({ ...q, order: +e.target.value }))} /></div>
              <div><label className="field-label">Marks</label><input className="field-input" type="number" min={1} required value={addQ.marks} onChange={e => setAddQ(q => ({ ...q, marks: +e.target.value }))} /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
              {saving ? <Spinner size={16} color="white" /> : <><ChevronRight size={15} /> Add to Exam</>}
            </button>
          </form>
        </div>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Delete Exam" message={`Delete "${deleting?.title}"? All sessions and results will also be removed.`} />
    </div>
  )
}
