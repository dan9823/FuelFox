const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const store = require('../services/store');

const router = express.Router();

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getOrCreateDailyLog(userId, date) {
  const logs = store.filterByField('dailyLogs', 'userId', userId);
  let log = logs.find((l) => l.date === date);
  if (!log) {
    log = {
      id: uuidv4(),
      userId,
      date,
      calories: 0,
      carbs: 0,
      fats: 0,
      proteins: 0,
      meals: [],
      waterMl: 0,
      fastingStartTime: null,
      fastingEndTime: null,
      weight: null,
      coinsEarned: 0,
      createdAt: new Date().toISOString(),
    };
    store.insert('dailyLogs', log);
  }
  return log;
}

// GET /api/meals/today
router.get('/today', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);
  res.json(log);
});

// GET /api/meals/history?days=7
router.get('/history', authMiddleware, (req, res) => {
  const days = parseInt(req.query.days, 10) || 7;
  const logs = store.filterByField('dailyLogs', 'userId', req.userId);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = logs
    .filter((l) => new Date(l.date) >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(filtered);
});

// POST /api/meals/log
router.post('/log', authMiddleware, (req, res) => {
  const { name, calories, carbs, fats, proteins, type, date } = req.body;

  if (!name || calories == null) {
    return res.status(400).json({ error: 'Name and calories are required' });
  }

  const logDate = date || getTodayString();
  const log = getOrCreateDailyLog(req.userId, logDate);

  const meal = {
    id: uuidv4(),
    name,
    calories: Number(calories) || 0,
    carbs: Number(carbs) || 0,
    fats: Number(fats) || 0,
    proteins: Number(proteins) || 0,
    type: type || 'meal',
    time: new Date().toISOString(),
  };

  const updatedMeals = [...log.meals, meal];
  const updated = store.update('dailyLogs', log.id, {
    meals: updatedMeals,
    calories: log.calories + meal.calories,
    carbs: log.carbs + meal.carbs,
    fats: log.fats + meal.fats,
    proteins: log.proteins + meal.proteins,
  });

  res.status(201).json({ meal, dailyLog: updated });
});

// DELETE /api/meals/:mealId
router.delete('/:mealId', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);

  const meal = log.meals.find((m) => m.id === req.params.mealId);
  if (!meal) return res.status(404).json({ error: 'Meal not found' });

  const updatedMeals = log.meals.filter((m) => m.id !== req.params.mealId);
  const updated = store.update('dailyLogs', log.id, {
    meals: updatedMeals,
    calories: log.calories - meal.calories,
    carbs: log.carbs - meal.carbs,
    fats: log.fats - meal.fats,
    proteins: log.proteins - meal.proteins,
  });

  res.json(updated);
});

// POST /api/meals/weight
router.post('/weight', authMiddleware, (req, res) => {
  const { weight, date } = req.body;
  if (weight == null) return res.status(400).json({ error: 'Weight is required' });

  const logDate = date || getTodayString();
  const log = getOrCreateDailyLog(req.userId, logDate);
  const updated = store.update('dailyLogs', log.id, { weight: Number(weight) });

  res.json(updated);
});

module.exports = router;
