const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const store = require('../services/store');

const router = express.Router();

const DAILY_CHALLENGE_TEMPLATES = [
  { title: 'Log all meals', description: 'Track every meal you eat today', coinReward: 10, requirement: 'log_3_meals' },
  { title: 'Drink 8 glasses', description: 'Reach your water goal for the day', coinReward: 10, requirement: 'water_goal' },
  { title: 'Hit your calorie target', description: 'Stay within 100 kcal of your goal', coinReward: 15, requirement: 'calorie_target' },
  { title: 'Complete a 16h fast', description: 'Finish an intermittent fasting session', coinReward: 20, requirement: 'fasting_16h' },
  { title: 'Scan a meal photo', description: 'Use AI to log a meal from a photo', coinReward: 10, requirement: 'scan_meal' },
];

const WEEKLY_CHALLENGE_TEMPLATES = [
  { title: 'Perfect week', description: 'Log meals every day for 7 days', coinReward: 50, requirement: '7_day_streak' },
  { title: 'Hydration hero', description: 'Hit water goal 5 out of 7 days', coinReward: 40, requirement: 'water_5_days' },
  { title: 'Macro master', description: 'Hit all macro targets for 3 days', coinReward: 60, requirement: 'macros_3_days' },
];

function generateDailyChallenges() {
  const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((template) => ({
    id: uuidv4(),
    ...template,
    type: 'daily',
    progress: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  }));
}

function generateWeeklyChallenges() {
  const shuffled = [...WEEKLY_CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2).map((template) => ({
    id: uuidv4(),
    ...template,
    type: 'weekly',
    progress: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  }));
}

// GET /api/challenges
router.get('/', authMiddleware, (req, res) => {
  let userChallenges = store.filterByField('challenges', 'userId', req.userId);

  const today = new Date().toISOString().split('T')[0];
  const dailyExists = userChallenges.some(
    (c) => c.type === 'daily' && c.createdAt.startsWith(today)
  );

  if (!dailyExists) {
    const newDaily = generateDailyChallenges().map((c) => ({
      ...c,
      userId: req.userId,
    }));
    newDaily.forEach((c) => store.insert('challenges', c));
    userChallenges = [...userChallenges, ...newDaily];
  }

  const weekStart = getWeekStart();
  const weeklyExists = userChallenges.some(
    (c) => c.type === 'weekly' && c.createdAt >= weekStart
  );

  if (!weeklyExists) {
    const newWeekly = generateWeeklyChallenges().map((c) => ({
      ...c,
      userId: req.userId,
    }));
    newWeekly.forEach((c) => store.insert('challenges', c));
    userChallenges = [...userChallenges, ...newWeekly];
  }

  const daily = userChallenges.filter(
    (c) => c.type === 'daily' && c.createdAt.startsWith(today)
  );
  const weekly = userChallenges.filter(
    (c) => c.type === 'weekly' && c.createdAt >= weekStart
  );

  res.json({ daily, weekly });
});

// POST /api/challenges/:id/complete
router.post('/:id/complete', authMiddleware, (req, res) => {
  const challenge = store.findById('challenges', req.params.id);
  if (!challenge || challenge.userId !== req.userId) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  if (challenge.completed) {
    return res.status(400).json({ error: 'Challenge already completed' });
  }

  const updated = store.update('challenges', challenge.id, {
    completed: true,
    progress: 100,
    completedAt: new Date().toISOString(),
  });

  // Award coins
  const userCoins = store.filterByField('coins', 'userId', req.userId);
  store.insert('coins', {
    id: uuidv4(),
    userId: req.userId,
    amount: challenge.coinReward,
    reason: `Challenge: ${challenge.title}`,
    createdAt: new Date().toISOString(),
  });

  const totalCoins = userCoins.reduce((sum, c) => sum + c.amount, 0) + challenge.coinReward;

  res.json({ challenge: updated, coinsAwarded: challenge.coinReward, totalCoins });
});

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

module.exports = router;
