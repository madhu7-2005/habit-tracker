const db = require('../db');

async function createHabit({ name, note }) {
  const res = await db.query(
    'INSERT INTO habits (name, note, created_at) VALUES ($1, $2, now()) RETURNING *',
    [name, note]
  );
  return res.rows[0];
}

async function getAllHabits() {
  const res = await db.query('SELECT * FROM habits ORDER BY id');
  return res.rows;
}

async function getHabitById(id) {
  const res = await db.query('SELECT * FROM habits WHERE id = $1', [id]);
  return res.rows[0];
}

async function updateHabit(id, { name, note }) {
  const res = await db.query(
    'UPDATE habits SET name=$1, note=$2 WHERE id=$3 RETURNING *',
    [name, note, id]
  );
  return res.rows[0];
}

async function deleteHabit(id) {
  await db.query('DELETE FROM completions WHERE habit_id=$1', [id]);
  const res = await db.query('DELETE FROM habits WHERE id=$1 RETURNING *', [id]);
  return res.rows[0];
}

async function addCompletion(habitId, dateStr) {
  const res = await db.query(
    'INSERT INTO completions (habit_id, completed_date) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [habitId, dateStr]
  );
  return res.rows[0];
}

async function removeCompletion(habitId, dateStr) {
  const res = await db.query(
    'DELETE FROM completions WHERE habit_id=$1 AND completed_date=$2 RETURNING *',
    [habitId, dateStr]
  );
  return res.rows[0];
}

async function getCompletions(habitId) {
  const res = await db.query(
    'SELECT completed_date FROM completions WHERE habit_id=$1 ORDER BY completed_date DESC',
    [habitId]
  );
  return res.rows.map(r => r.completed_date.toISOString().slice(0,10));
}

module.exports = {
  createHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  addCompletion,
  removeCompletion,
  getCompletions,
};
