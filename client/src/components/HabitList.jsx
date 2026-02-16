import React from 'react'
import HabitItem from './HabitItem'

export default function HabitList({ habits, onComplete, onDelete }){
  if (!habits || habits.length === 0) return <div>No habits yet.</div>
  return (
    <div>
      {habits.map(h => (
        <HabitItem key={h.id} habit={h} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </div>
  )
}
