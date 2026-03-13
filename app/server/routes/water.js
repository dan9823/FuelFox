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

// POST /api/water/add
router.post('/add', authMiddleware, (req, res) => {
  const { amountMl } = req.body;
  if (!amountMl || amountMl <= 0) {
    return res.status(400).json({ error: 'Valid amountMl is required' });
  }

  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);
  const updated = store.update('dailyLogs', log.id, {
    waterMl: log.waterMl + Number(amountMl),
  });

  res.json({ waterMl: updated.waterMl });
});

// GET /api/water/today
router.get('/today', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);
  const goals = store.findByField('goals', 'userId', req.userId);

  res.json({
    waterMl: log.waterMl,
    goalMl: goals?.waterMl || 2500,
    percentage: goals?.waterMl ? Math.round((log.waterMl / goals.waterMl) * 100) : 0,
  });
});

module.exports = router;
