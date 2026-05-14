import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/accounts'
import { getClasses } from '../../api/academics'
import Modal   from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

const EMPTY = { first_name: '', last_name: '', email: '', password: '', reg_number: '', student_class: '' }

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [classes,  setClasses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try {
      const [s, c] = await Promise.all([getStudents(), getClasses()])
      setStudents(s.data?.results ?? s.data ?? [])
      setClasses(c.data?.results  ?? c.data  ?? [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (s)  => { setEditing(s); setForm({ first_name: s.user.first_name, last_name: s.user.last_name, email: s.user.email, password: '', reg_number: s.reg_number, student_class: s.student_class }); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        await updateStudent(editing.id, { reg_number: form.reg_number, student_class: form.student_class })
        toast.success('Student updated')
      } else {
        await createStudent(form)
        toast.success('Student created')
      }
      setModal(false); load()
    } catch (err) {
      toast.error(Object.values(err.response?.data || {})[0]?.[0] || 'Failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteStudent(deleting.id)
      toast.success('Student deleted'); setDeleting(null); load()
    } catch { toast.error('Failed to delete') }
    finally { setSaving(false) }
  }

  const filtered = students.filter(s =>
    `${s.user.first_name} ${s.user.last_name} ${s.reg_number}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Students</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{students.length} enrolled</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Student</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input className="field-input" placeholder="Search students…" style={{ paddingLeft: '2.25rem' }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
        ) : (
          <table className="tbl">
            <thead><tr>
              <th>Name</th><th>Reg Number</th><th>Class</th><th>Email</th><th style={{ width: 80 }}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{s.user.first_name} {s.user.last_name}</td>
                  <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>{s.reg_number}</span></td>
                  <td>{s.class_name}</td>
                  <td style={{ color: '#94A3B8' }}>{s.user.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleting(s)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No students found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!editing && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="field-label">First Name</label>
                <input className="field-input" required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Last Name</label>
                <input className="field-input" required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="field-label">Email</label>
              <input className="field-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input className="field-input" type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </>}
          <div>
            <label className="field-label">Reg Number</label>
            <input className="field-input" required value={form.reg_number} onChange={e => setForm(f => ({ ...f, reg_number: e.target.value }))} placeholder="e.g. SS1/001" />
          </div>
          <div>
            <label className="field-label">Class</label>
            <select className="field-input" required value={form.student_class} onChange={e => setForm(f => ({ ...f, student_class: e.target.value }))}>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner size={16} color="white" /> : editing ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Delete Student" message={`Remove ${deleting?.user?.first_name} ${deleting?.user?.last_name}? This cannot be undone.`} />
    </div>
  )
}
