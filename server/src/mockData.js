// In-memory mock database
let habits = [
  { id: 1, name: 'Morning Run', note: 'Get cardio in early', created_at: new Date('2026-01-01') },
  { id: 2, name: 'Read 30 mins', note: 'Before bed', created_at: new Date('2026-01-15') },
];
let completions = {
  1: ['2026-02-14', '2026-02-13', '2026-02-12'],
  2: ['2026-02-14'],
};
let nextId = 3;

module.exports = {
  habits,
  completions,
  getNextId: () => nextId++,
};
