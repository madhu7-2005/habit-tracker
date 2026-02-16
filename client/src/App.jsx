import React, { useEffect, useState } from 'react'
import { listHabits, createHabit, completeHabit, deleteHabit } from './api'
import HabitList from './components/HabitList'
import HabitForm from './components/HabitForm'

export default function App(){
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetch() {
    setLoading(true)
    try{
      const h = await listHabits()
      setHabits(h)
    }catch(e){ setError('Failed to load habits') }
    setLoading(false)
  }

  useEffect(()=>{ fetch() }, [])

  async function handleAdd(data){
    try{
      await createHabit(data)
      await fetch()
    }catch(e){ setError('Failed to create habit') }
  }

  async function handleComplete(id){
    try{ await completeHabit(id); await fetch() }catch(e){ setError('Failed to mark complete') }
  }

  async function handleDelete(id){
    try{ await deleteHabit(id); await fetch() }catch(e){ setError('Failed to delete') }
  }

  return (
    <div style={{maxWidth:800, margin:'20px auto', padding:'0 12px'}}>
      <h1>Habit Tracker</h1>
      <HabitForm onAdd={handleAdd} />
      {error && <div style={{color:'red'}}>{error}</div>}
      {loading ? <div>Loading...</div> : <HabitList habits={habits} onComplete={handleComplete} onDelete={handleDelete} />}
    </div>
  )
}
