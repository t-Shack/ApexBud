import { useState, useEffect } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTeachers, createTeacher, deleteTeacher } from '../../api/accounts'
import Modal from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

const EMPTY = { first_name: '', last_name: '', email: '', password: '', staff_id: '' }

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try { const r = await getTeachers(); setTeachers(r.data?.results ?? r.data ?? []) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await createTeacher(form); toast.success('Teacher added')
      setModal(false); setForm(EMPTY); load()
    } catch (err) { toast.error(Object.values(err.response?.data || {})[0]?.[0] || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteTeacher(deleting.id); toast.success('Teacher removed'); setDeleting(null); load() }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const filtered = teachers.filter(t =>
    `${t.user.first_name} ${t.user.last_name} ${t.staff_id}`.toLowerCase().includes(search.toLowerCase())
  )

  const F = ({ label, ...props }) => (
    <div><label className="field-label">{label}</label><input className="field-input" {...props} onChange={e => setForm(f => ({ ...f, [props.name]: e.target.value }))} /></div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Teachers</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{teachers.length} staff members</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true) }}><Plus size={16} /> Add Teacher</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input className="field-input" placeholder="Search teachers…" style={{ paddingLeft: '2.25rem' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <table className="tbl">
            <thead><tr><th>Name</th><th>Staff ID</th><th>Email</th><th style={{ width: 60 }}></th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{t.user.first_name} {t.user.last_name}</td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{t.staff_id}</code></td>
                  <td style={{ color: '#94A3B8' }}>{t.user.email}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => setDeleting(t)}><Trash2 size={13} /></button></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No teachers found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Teacher">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <F label="First Name" name="first_name" required value={form.first_name} />
            <F label="Last Name"  name="last_name"  required value={form.last_name}  />
          </div>
          <F label="Email"    name="email"    type="email"    required value={form.email} />
          <F label="Password" name="password" type="password" required minLength={8} value={form.password} placeholder="Min 8 characters" />
          <F label="Staff ID" name="staff_id" required value={form.staff_id} placeholder="e.g. TCH/001" />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : 'Add Teacher'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Remove Teacher" message={`Remove ${deleting?.user?.first_name} ${deleting?.user?.last_name} from the platform?`} />
    </div>
  )
}
