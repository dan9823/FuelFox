const express = require('express');
const authMiddleware = require('../middleware/auth');
const store = require('../services/store');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, (req, res) => {
  const user = store.findById('users', req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const profile = store.findByField('profiles', 'userId', req.userId);
  const goals = store.findByField('goals', 'userId', req.userId);

  res.json({ user, profile, goals });
});

// PUT /api/user/goals
router.put('/goals', authMiddleware, (req, res) => {
  const goals = store.findByField('goals', 'userId', req.userId);
  if (!goals) return res.status(404).json({ error: 'Goals not found' });

  const updated = store.update('goals', goals.id, {
    ...req.body,
    updatedAt: new Date().toISOString(),
  });

  res.json(updated);
});

// PUT /api/user/profile
router.put('/profile', authMiddleware, (req, res) => {
  const profile = store.findByField('profiles', 'userId', req.userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const updated = store.update('profiles', profile.id, req.body);
  res.json(updated);
});

// GET /api/user/stats
router.get('/stats', authMiddleware, (req, res) => {
  const logs = store.filterByField('dailyLogs', 'userId', req.userId);
  const streak = calculateStreak(logs);
  const totalDaysLogged = logs.filter((l) => l.calories > 0).length;

  res.json({
    streak,
    totalDaysLogged,
    coins: logs.reduce((sum, l) => sum + (l.coinsEarned || 0), 0),
  });
});

function calculateStreak(logs) {
  if (!logs.length) return 0;
  const sorted = [...logs]
    .filter((l) => l.calories > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const logDate = new Date(sorted[i].date);
    logDate.setHours(0, 0, 0, 0);
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);

    if (logDate.getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

module.exports = router;
