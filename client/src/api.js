import axios from 'axios'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api'

export async function listHabits(){
  const res = await axios.get(`${API}/habits`)
  return res.data
}

export async function createHabit(payload){
  const res = await axios.post(`${API}/habits`, payload)
  return res.data
}

export async function completeHabit(id){
  const res = await axios.post(`${API}/habits/${id}/complete`)
  return res.data
}

export async function deleteHabit(id){
  const res = await axios.delete(`${API}/habits/${id}`)
  return res.data
}
