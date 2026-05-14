import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.first_name}!`)
      if (user.role === 'admin')   navigate('/admin')
      if (user.role === 'teacher') navigate('/teacher')
      if (user.role === 'student') navigate('/student')
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '9999px', border: '1px solid rgba(245,158,11,.15)', top: '-100px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '9999px', border: '1px solid rgba(245,158,11,.08)', bottom: '-200px', right: '-150px' }} />

        <div style={{ position: 'relative', maxWidth: '360px', textAlign: 'center' }}>
          <div style={{ width: '4rem', height: '4rem', background: '#F59E0B', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <GraduationCap size={32} color="#0F172A" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            CBT Platform
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
            A computer-based testing platform for secondary school students. Secure, fast, and automatic marking.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2.5rem' }}>
            {['Admin', 'Teacher', 'Student'].map(role => (
              <div key={role} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,.1)', color: '#94A3B8', fontSize: '0.75rem' }}>
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.375rem' }}>Sign in</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '2rem' }}>Enter your credentials to access your portal</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="field-label">Email address</label>
              <input className="field-input" type="email" placeholder="you@school.ng" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="field-input" type={show ? 'text' : 'password'} placeholder="••••••••" required
                  style={{ paddingRight: '2.75rem' }}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', height: '2.75rem' }} disabled={loading}>
              {loading ? <Spinner size={18} color="white" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
