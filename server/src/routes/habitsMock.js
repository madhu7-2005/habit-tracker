const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { habits, completions, getNextId } = require('../mockData');

function computeStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  let streak = 0;
  let expected = new Date();
  expected.setUTCHours(0,0,0,0);

  for (let d of dates) {
    const dt = new Date(d + 'T00:00:00Z');
    const expY = expected.toISOString().slice(0,10);
    const dtY = dt.toISOString().slice(0,10);
    if (dtY === expY) {
      streak++;
      expected.setUTCDate(expected.getUTCDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const habitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  note: Joi.string().allow('', null).max(1000),
});

router.get('/', (req, res) => {
  const enhanced = habits.map(h => ({
    ...h,
    completions: (completions[h.id] || []).sort().reverse(),
    streak: computeStreak(completions[h.id] || []),
  }));
  res.json(enhanced);
});

router.post('/', (req, res) => {
  const { error, value } = habitSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const id = getNextId();
  const created = { id, ...value, created_at: new Date() };
  habits.push(created);
  completions[id] = [];
  res.status(201).json(created);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const h = habits.find(x => x.id === id);
  if (!h) return res.status(404).json({ error: 'Not found' });
  const comps = completions[id] || [];
  res.json({ ...h, completions: comps.sort().reverse(), streak: computeStreak(comps) });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { error, value } = habitSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const h = habits.find(x => x.id === id);
  if (!h) return res.status(404).json({ error: 'Not found' });
  h.name = value.name;
  h.note = value.note;
  res.json(h);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = habits.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = habits.splice(idx, 1)[0];
  delete completions[id];
  res.json({ deleted });
});

router.post('/:id/complete', (req, res) => {
  const id = parseInt(req.params.id);
  const date = req.body.date || new Date().toISOString().slice(0,10);
  if (!completions[id]) completions[id] = [];
  if (!completions[id].includes(date)) {
    completions[id].push(date);
  }
  const comps = completions[id].sort().reverse();
  res.json({ completion: { id, date }, completions: comps, streak: computeStreak(comps) });
});

router.post('/:id/uncomplete', (req, res) => {
  const id = parseInt(req.params.id);
  const date = req.body.date || new Date().toISOString().slice(0,10);
  if (!completions[id]) completions[id] = [];
  const idx = completions[id].indexOf(date);
  if (idx !== -1) completions[id].splice(idx, 1);
  const comps = completions[id].sort().reverse();
  res.json({ removed: { id, date }, completions: comps, streak: computeStreak(comps) });
});

module.exports = router;
