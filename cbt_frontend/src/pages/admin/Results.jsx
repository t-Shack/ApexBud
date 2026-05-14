import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { getScores } from '../../api/results'
import { getExams }  from '../../api/exams'
import Spinner from '../../components/common/Spinner'

export default function AdminResults() {
  const [results,    setResults]    = useState([])
  const [exams,      setExams]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [examFilter, setExamFilter] = useState('')

  const load = async (examId = '') => {
    setLoading(true)
    try {
      const params = examId ? { exam_id: examId } : {}
      const [r, e] = await Promise.all([getScores(params), getExams()])
      setResults(r.data?.results ?? r.data ?? [])
      setExams(e.data?.results ?? e.data ?? [])
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleFilter = (e) => {
    setExamFilter(e.target.value)
    load(e.target.value)
  }

  const pctColor = (p) => p >= 70 ? '#059669' : p >= 50 ? '#D97706' : '#DC2626'
  const pctBg    = (p) => p >= 70 ? '#ECFDF5' : p >= 50 ? '#FFFBEB' : '#FEF2F2'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div><h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Results</h1><p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{results.length} records</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="#94A3B8" />
          <select className="field-input" style={{ width: '220px' }} value={examFilter} onChange={handleFilter}>
            <option value="">All Exams</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <table className="tbl">
            <thead><tr><th>Student</th><th>Reg No.</th><th>Exam</th><th style={{ textAlign: 'center' }}>Score</th><th style={{ textAlign: 'center' }}>Total</th><th style={{ textAlign: 'center' }}>Percentage</th></tr></thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{r.student_name}</td>
                  <td><code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{r.reg_number}</code></td>
                  <td>{r.exam_title}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{r.total_score}</td>
                  <td style={{ textAlign: 'center', color: '#94A3B8' }}>{r.total_marks}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ background: pctBg(r.percentage), color: pctColor(r.percentage), padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {r.percentage.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              {!results.length && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No results yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
