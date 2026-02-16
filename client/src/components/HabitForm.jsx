import React, { useState } from 'react'

export default function HabitForm({ onAdd }){
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState(null)

  async function submit(e){
    e.preventDefault()
    setError(null)
    if (!name.trim()) return setError('Name is required')
    try{
      await onAdd({ name: name.trim(), note })
      setName('')
      setNote('')
    }catch(err){ setError('Failed to add habit') }
  }

  return (
    <form onSubmit={submit} style={{marginBottom:16}}>
      <div>
        <input placeholder="Habit name" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <input placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      <button type="submit">Add Habit</button>
    </form>
  )
}
