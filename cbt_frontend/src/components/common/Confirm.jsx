import Modal from './Modal'
import Spinner from './Spinner'

export default function Confirm({ open, onClose, onConfirm, loading, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.5rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner size={16} color="#DC2626" /> : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}
