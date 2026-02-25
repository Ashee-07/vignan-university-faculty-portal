
import React from 'react'
import { api } from '../../../lib.js'
import { useAuth } from '../../../store.js'

export default function GradeEntry() {
  const { token } = useAuth()
  const [form, setForm] = React.useState({ registerId:'', courseCode:'', assignment:'A1', maxMarks:100, marks:0 })
  const [msg, setMsg] = React.useState('')

  const set = (k,v)=>setForm(prev=>({ ...prev, [k]: v }))

  const submit = async () => {
    setMsg('')
    try {
      await api('/faculty/grades', 'POST', form, token)
      setMsg('Saved grade ✅')
    } catch(e) { setMsg(e.message) }
  }

  return (
    <div className="stack">
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12}}>
        <div className="stack">
          <label>Register ID</label>
          <input className="input" value={form.registerId} onChange={e=>set('registerId', e.target.value)} />
        </div>
        <div className="stack">
          <label>Course Code</label>
          <input className="input" value={form.courseCode} onChange={e=>set('courseCode', e.target.value)} />
        </div>
        <div className="stack">
          <label>Assignment</label>
          <input className="input" value={form.assignment} onChange={e=>set('assignment', e.target.value)} />
        </div>
        <div className="stack">
          <label>Max Marks</label>
          <input className="input" type="number" value={form.maxMarks} onChange={e=>set('maxMarks', Number(e.target.value))} />
        </div>
        <div className="stack">
          <label>Marks</label>
          <input className="input" type="number" value={form.marks} onChange={e=>set('marks', Number(e.target.value))} />
        </div>
      </div>
      <button className="button" onClick={submit}>Save</button>
      {msg && <div>{msg}</div>}
    </div>
  )
}
