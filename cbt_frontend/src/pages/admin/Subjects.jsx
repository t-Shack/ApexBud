import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSubjects, createSubject, deleteSubject } from '../../api/academics'
import { getClasses } from '../../api/academics'
import { getTeachers } from '../../api/accounts'
import Modal from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [classes,  setClasses]  = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({ name: '', subject_class: '', teacher: '' })

  const load = async () => {
    setLoading(true)
    try {
      const [s, c, t] = await Promise.all([getSubjects(), getClasses(), getTeachers()])
      setSubjects(s.data?.results ?? s.data ?? [])
      setClasses(c.data?.results  ?? c.data  ?? [])
      setTeachers(t.data?.results ?? t.data  ?? [])
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await createSubject(form); toast.success('Subject created')
      setModal(false); setForm({ name: '', subject_class: '', teacher: '' }); load()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteSubject(deleting.id); toast.success('Deleted'); setDeleting(null); load() }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Subjects</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{subjects.length} subjects</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Subject</button>
      </div>

      <div className="card">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <table className="tbl">
            <thead><tr><th>Subject</th><th>Class</th><th>Teacher</th><th style={{ width: 60 }}></th></tr></thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{s.name}</td>
                  <td>{s.class_name}</td>
                  <td style={{ color: '#94A3B8' }}>{s.teacher_name || '—'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => setDeleting(s)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
              {!subjects.length && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No subjects yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Subject" width="max-w-sm">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="field-label">Subject Name</label><input className="field-input" required placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="field-label">Class</label>
            <select className="field-input" required value={form.subject_class} onChange={e => setForm(f => ({ ...f, subject_class: e.target.value }))}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="field-label">Assign Teacher (optional)</label>
            <select className="field-input" value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))}>
              <option value="">None</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.user.first_name} {t.user.last_name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Delete Subject" message={`Delete ${deleting?.name}?`} />
    </div>
  )
}
