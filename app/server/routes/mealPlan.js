const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const store = require('../services/store');

const router = express.Router();

// Meal template database - varied per diet type
const MEAL_TEMPLATES = {
  balanced: {
    breakfast: [
      { name: 'Oatmeal with berries', calories: 320, carbs: 52, fats: 8, proteins: 12 },
      { name: 'Greek yogurt parfait', calories: 280, carbs: 38, fats: 6, proteins: 20 },
      { name: 'Avocado toast with eggs', calories: 380, carbs: 30, fats: 22, proteins: 16 },
      { name: 'Smoothie bowl', calories: 340, carbs: 56, fats: 8, proteins: 14 },
      { name: 'Whole grain pancakes', calories: 360, carbs: 48, fats: 10, proteins: 18 },
    ],
    lunch: [
      { name: 'Grilled chicken salad', calories: 420, carbs: 22, fats: 18, proteins: 42 },
      { name: 'Turkey & veggie wrap', calories: 380, carbs: 38, fats: 14, proteins: 28 },
      { name: 'Quinoa power bowl', calories: 450, carbs: 52, fats: 16, proteins: 24 },
      { name: 'Salmon poke bowl', calories: 480, carbs: 46, fats: 18, proteins: 32 },
      { name: 'Lentil soup with bread', calories: 400, carbs: 56, fats: 8, proteins: 22 },
    ],
    dinner: [
      { name: 'Grilled salmon with veggies', calories: 520, carbs: 24, fats: 28, proteins: 44 },
      { name: 'Lean beef stir-fry', calories: 480, carbs: 32, fats: 18, proteins: 42 },
      { name: 'Chicken breast with sweet potato', calories: 500, carbs: 46, fats: 12, proteins: 48 },
      { name: 'Shrimp pasta', calories: 520, carbs: 56, fats: 16, proteins: 34 },
      { name: 'Tofu curry with rice', calories: 460, carbs: 58, fats: 14, proteins: 22 },
    ],
    snack: [
      { name: 'Apple with almond butter', calories: 200, carbs: 22, fats: 12, proteins: 4 },
      { name: 'Protein bar', calories: 220, carbs: 26, fats: 8, proteins: 16 },
      { name: 'Mixed nuts', calories: 180, carbs: 8, fats: 16, proteins: 6 },
      { name: 'Cottage cheese with fruit', calories: 160, carbs: 14, fats: 4, proteins: 16 },
      { name: 'Hummus with carrots', calories: 150, carbs: 18, fats: 8, proteins: 6 },
    ],
  },
  keto: {
    breakfast: [
      { name: 'Bacon & eggs', calories: 400, carbs: 2, fats: 32, proteins: 28 },
      { name: 'Keto smoothie', calories: 350, carbs: 4, fats: 30, proteins: 16 },
      { name: 'Cheese omelet', calories: 380, carbs: 3, fats: 30, proteins: 26 },
    ],
    lunch: [
      { name: 'Caesar salad (no croutons)', calories: 420, carbs: 6, fats: 34, proteins: 24 },
      { name: 'Bunless burger with avocado', calories: 480, carbs: 4, fats: 38, proteins: 32 },
    ],
    dinner: [
      { name: 'Steak with butter and greens', calories: 560, carbs: 4, fats: 42, proteins: 44 },
      { name: 'Salmon with asparagus', calories: 500, carbs: 6, fats: 36, proteins: 40 },
    ],
    snack: [
      { name: 'Cheese & nuts', calories: 200, carbs: 2, fats: 18, proteins: 8 },
      { name: 'Avocado halves', calories: 180, carbs: 4, fats: 16, proteins: 2 },
    ],
  },
};

// Fill missing diet types with balanced defaults
const DIET_TYPES = ['balanced', 'keto', 'high_protein', 'low_carb', 'vegan', 'mediterranean', 'paleo'];
DIET_TYPES.forEach((type) => {
  if (!MEAL_TEMPLATES[type]) {
    MEAL_TEMPLATES[type] = MEAL_TEMPLATES.balanced;
  }
});

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function generateWeeklyPlan(dietType, calorieGoal) {
  const templates = MEAL_TEMPLATES[dietType] || MEAL_TEMPLATES.balanced;

  return DAYS.map((day) => {
    const breakfast = templates.breakfast[Math.floor(Math.random() * templates.breakfast.length)];
    const lunch = templates.lunch[Math.floor(Math.random() * templates.lunch.length)];
    const dinner = templates.dinner[Math.floor(Math.random() * templates.dinner.length)];
    const snack = templates.snack[Math.floor(Math.random() * templates.snack.length)];

    const meals = [
      { ...breakfast, mealType: 'breakfast' },
      { ...lunch, mealType: 'lunch' },
      { ...dinner, mealType: 'dinner' },
      { ...snack, mealType: 'snack' },
    ];

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    // Scale to match calorie goal
    const scale = calorieGoal / totalCalories;
    const scaledMeals = meals.map((m) => ({
      ...m,
      calories: Math.round(m.calories * scale),
      carbs: Math.round(m.carbs * scale),
      fats: Math.round(m.fats * scale),
      proteins: Math.round(m.proteins * scale),
    }));

    return {
      day,
      meals: scaledMeals,
      totalCalories: scaledMeals.reduce((sum, m) => sum + m.calories, 0),
    };
  });
}

// GET /api/meal-plan
router.get('/', authMiddleware, (req, res) => {
  let plan = store.findByField('mealPlans', 'userId', req.userId);

  if (!plan) {
    const profile = store.findByField('profiles', 'userId', req.userId);
    const goals = store.findByField('goals', 'userId', req.userId);
    const dietType = profile?.dietType || 'balanced';
    const calorieGoal = goals?.calories || 2000;

    plan = {
      id: uuidv4(),
      userId: req.userId,
      dietType,
      calorieGoal,
      weeklyPlan: generateWeeklyPlan(dietType, calorieGoal),
      generatedAt: new Date().toISOString(),
    };
    store.insert('mealPlans', plan);
  }

  res.json(plan);
});

// POST /api/meal-plan/regenerate
router.post('/regenerate', authMiddleware, (req, res) => {
  const existing = store.findByField('mealPlans', 'userId', req.userId);
  if (existing) {
    store.remove('mealPlans', existing.id);
  }

  const profile = store.findByField('profiles', 'userId', req.userId);
  const goals = store.findByField('goals', 'userId', req.userId);
  const dietType = profile?.dietType || 'balanced';
  const calorieGoal = goals?.calories || 2000;

  const plan = {
    id: uuidv4(),
    userId: req.userId,
    dietType,
    calorieGoal,
    weeklyPlan: generateWeeklyPlan(dietType, calorieGoal),
    generatedAt: new Date().toISOString(),
  };
  store.insert('mealPlans', plan);

  res.json(plan);
});

module.exports = router;
