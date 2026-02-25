
import React from 'react'
import { api } from '../../../lib.js'
import { useAuth } from '../../../store.js'

export default function AttendanceForm() {
  const { token } = useAuth()
  const [courseCode, setCourseCode] = React.useState('IT101')
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10))
  const [bulk, setBulk] = React.useState('21VV1A0101,P;21VV1A0102,A;21VV1A0103,P')
  const [msg, setMsg] = React.useState('')

  const parse = () => {
    return bulk.split(';').map(s => s.trim()).filter(Boolean).map(pair => {
      const [id, mark] = pair.split(',')
      return { registerId: id, present: (mark || 'P').toUpperCase().startsWith('P') }
    })
  }

  const submit = async () => {
    setMsg('')
    try {
      await api('/faculty/attendance', 'POST', { courseCode, date, entries: parse() }, token)
      setMsg('Saved attendance ✅')
    } catch (e) { setMsg(e.message) }
  }

  return (
    <div className="stack">
      <label>Course Code</label>
      <input className="input" value={courseCode} onChange={e => setCourseCode(e.target.value)} />
      <label>Date</label>
      <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
      <label>Bulk Paste (RegisterId, P/A; ...)</label>
      <textarea className="input" rows="4" value={bulk} onChange={e => setBulk(e.target.value)} />
      <button className="button" onClick={submit}>Save Attendance</button>
      {msg && <div>{msg}</div>}
    </div>
  )
}
