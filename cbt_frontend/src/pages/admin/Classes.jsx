import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getClasses, createClass, deleteClass } from '../../api/academics'
import Modal from '../../components/common/Modal'
import Confirm from '../../components/common/Confirm'
import Spinner from '../../components/common/Spinner'

export default function AdminClasses() {
  const [classes,  setClasses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({ name: '', level: '' })

  const load = async () => {
    setLoading(true)
    try { const r = await getClasses(); setClasses(r.data?.results ?? r.data ?? []) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await createClass(form); toast.success('Class created'); setModal(false); setForm({ name: '', level: '' }); load() }
    catch { toast.error('Failed to create class') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteClass(deleting.id); toast.success('Class deleted'); setDeleting(null); load() }
    catch { toast.error('Failed') } finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Classes</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{classes.length} classes</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Add Class</button>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {classes.map(c => (
            <div key={c.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{c.level}</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleting(c)}><Trash2 size={13} /></button>
            </div>
          ))}
          {!classes.length && <div style={{ color: '#94A3B8', padding: '2rem', gridColumn: '1/-1', textAlign: 'center' }}>No classes yet</div>}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Class" width="max-w-sm">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="field-label">Class Name</label><input className="field-input" required placeholder="e.g. SS1A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="field-label">Level</label>
            <select className="field-input" required value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
              <option value="">Select level</option>
              <option>Junior Secondary</option>
              <option>Senior Secondary</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <Confirm open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} loading={saving}
        title="Delete Class" message={`Delete class ${deleting?.name}? All associated students will be unassigned.`} />
    </div>
  )
}
