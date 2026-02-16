import React from 'react'

export default function HabitItem({ habit, onComplete, onDelete }){
  return (
    <div style={{border:'1px solid #ddd', padding:8, marginBottom:8, borderRadius:6}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div>
          <strong>{habit.name}</strong>
          <div style={{fontSize:12, color:'#555'}}>{habit.note}</div>
        </div>
        <div>
          <div style={{textAlign:'right'}}>
            <div>Streak: {habit.streak || 0}</div>
            <button onClick={()=>onComplete(habit.id)}>Complete</button>
            <button onClick={()=>onDelete(habit.id)} style={{marginLeft:8}}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
