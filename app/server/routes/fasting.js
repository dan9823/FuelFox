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

// POST /api/fasting/start
router.post('/start', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);

  if (log.fastingStartTime && !log.fastingEndTime) {
    return res.status(400).json({ error: 'Fasting already in progress' });
  }

  const updated = store.update('dailyLogs', log.id, {
    fastingStartTime: new Date().toISOString(),
    fastingEndTime: null,
  });

  res.json({
    fastingStartTime: updated.fastingStartTime,
    fastingEndTime: updated.fastingEndTime,
  });
});

// POST /api/fasting/stop
router.post('/stop', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);

  if (!log.fastingStartTime) {
    return res.status(400).json({ error: 'No fasting in progress' });
  }

  const endTime = new Date().toISOString();
  const startTime = new Date(log.fastingStartTime);
  const durationHours = (new Date(endTime) - startTime) / (1000 * 60 * 60);

  const updated = store.update('dailyLogs', log.id, {
    fastingEndTime: endTime,
  });

  res.json({
    fastingStartTime: updated.fastingStartTime,
    fastingEndTime: updated.fastingEndTime,
    durationHours: Math.round(durationHours * 10) / 10,
  });
});

// GET /api/fasting/status
router.get('/status', authMiddleware, (req, res) => {
  const today = getTodayString();
  const log = getOrCreateDailyLog(req.userId, today);
  const goals = store.findByField('goals', 'userId', req.userId);

  let elapsedHours = 0;
  if (log.fastingStartTime && !log.fastingEndTime) {
    elapsedHours = (Date.now() - new Date(log.fastingStartTime)) / (1000 * 60 * 60);
  } else if (log.fastingStartTime && log.fastingEndTime) {
    elapsedHours = (new Date(log.fastingEndTime) - new Date(log.fastingStartTime)) / (1000 * 60 * 60);
  }

  res.json({
    isActive: !!log.fastingStartTime && !log.fastingEndTime,
    startTime: log.fastingStartTime,
    endTime: log.fastingEndTime,
    elapsedHours: Math.round(elapsedHours * 10) / 10,
    goalHours: goals?.fastingHours || 16,
  });
});

module.exports = router;
