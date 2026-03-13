const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../services/store');
const { calculateDailyCalories, calculateMacros, calculateWaterGoal } = require('../services/calculations');

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { provider, providerId, email, name } = req.body;

  if (!provider || !providerId) {
    return res.status(400).json({ error: 'Provider and providerId are required' });
  }

  // Check if user already exists
  let user = store.findByField('users', 'providerId', providerId);
  if (user) {
    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    return res.json({ user, token });
  }

  // Create new user
  user = {
    id: uuidv4(),
    provider,
    providerId,
    email: email || null,
    name: name || '',
    foxName: '',
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    subscription: { plan: 'free', expiresAt: null },
  };

  store.insert('users', user);
  const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
  res.status(201).json({ user, token });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { provider, providerId } = req.body;

  const user = store.findByField('users', 'providerId', providerId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
  res.json({ user, token });
});

// POST /api/auth/complete-onboarding
router.post('/complete-onboarding', (req, res) => {
  const { userId, onboardingData } = req.body;

  const user = store.findById('users', userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const {
    gender, age, heightCm, weightKg, targetWeightKg,
    activityLevel, mainGoal, dietType, foxName,
    mealsPerDay, eatingWindowStart, eatingWindowEnd,
  } = onboardingData;

  const dailyCalories = calculateDailyCalories(gender, age, heightCm, weightKg, activityLevel, mainGoal);
  const macros = calculateMacros(dailyCalories, dietType);
  const waterGoalMl = calculateWaterGoal(weightKg, gender);

  const profile = {
    id: uuidv4(),
    userId,
    gender,
    age,
    heightCm,
    weightKg,
    targetWeightKg,
    activityLevel,
    mainGoal,
    dietType,
    mealsPerDay,
    eatingWindowStart,
    eatingWindowEnd,
    createdAt: new Date().toISOString(),
  };
  store.insert('profiles', profile);

  const goals = {
    id: uuidv4(),
    userId,
    calories: dailyCalories,
    carbsG: macros?.carbsG || 250,
    fatsG: macros?.fatsG || 56,
    proteinsG: macros?.proteinsG || 125,
    waterMl: waterGoalMl,
    fastingHours: 16,
    targetWeight: targetWeightKg,
    updatedAt: new Date().toISOString(),
  };
  store.insert('goals', goals);

  const updatedUser = store.update('users', userId, {
    foxName: foxName || '',
    onboardingComplete: true,
  });

  res.json({ user: updatedUser, profile, goals });
});

module.exports = router;
