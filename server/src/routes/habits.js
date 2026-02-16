const express = require('express');
const Joi = require('joi');
const router = express.Router();
const model = require('../models/habitModel');

function computeStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  // dates are 'YYYY-MM-DD' sorted desc
  let streak = 0;
  const today = new Date();
  // represent dates as UTC yyyy-mm-dd
  function toYMD(d) { return d; }
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
      // if completion is after expected (future) skip, else break
      break;
    }
  }
  return streak;
}

const habitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  note: Joi.string().allow('', null).max(1000),
});

router.get('/', async (req, res, next) => {
  try {
    const habits = await model.getAllHabits();
    // attach completions and streak
    const enhanced = await Promise.all(habits.map(async h => {
      const comps = await model.getCompletions(h.id);
      return { ...h, completions: comps, streak: computeStreak(comps) };
    }));
    res.json(enhanced);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = habitSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const created = await model.createHabit(value);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const h = await model.getHabitById(id);
    if (!h) return res.status(404).json({ error: 'Not found' });
    const comps = await model.getCompletions(id);
    h.completions = comps; h.streak = computeStreak(comps);
    res.json(h);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { error, value } = habitSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const updated = await model.updateHabit(id, value);
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await model.deleteHabit(id);
    res.json({ deleted });
  } catch (err) { next(err); }
});

// mark completion for a date (default today)
router.post('/:id/complete', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const date = req.body.date || new Date().toISOString().slice(0,10);
    const c = await model.addCompletion(id, date);
    const comps = await model.getCompletions(id);
    res.json({ completion: c, completions: comps, streak: computeStreak(comps) });
  } catch (err) { next(err); }
});

router.post('/:id/uncomplete', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const date = req.body.date || new Date().toISOString().slice(0,10);
    const r = await model.removeCompletion(id, date);
    const comps = await model.getCompletions(id);
    res.json({ removed: r, completions: comps, streak: computeStreak(comps) });
  } catch (err) { next(err); }
});

module.exports = router;
