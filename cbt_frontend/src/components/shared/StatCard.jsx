export default function StatCard({ label, value, color = 'var(--brand)' }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
      <div style={{ fontSize: 28, fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{label}</div>
    </div>
  )
}
