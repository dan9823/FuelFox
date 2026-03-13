// Mirrors the client-side calculations for server-side validation

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

function calculateDailyCalories(gender, age, heightCm, weightKg, activityLevel, mainGoal) {
  if (!gender || !age || !heightCm || !weightKg) return null;

  // Mifflin-St Jeor equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  let tdee = Math.round(bmr * multiplier);

  const goalAdjustments = {
    lose_weight: -500,
    maintain: 0,
    gain_muscle: 300,
  };
  tdee += goalAdjustments[mainGoal] || 0;

  return Math.max(1200, Math.min(4000, tdee));
}

function calculateMacros(dailyCalories, dietType) {
  if (!dailyCalories) return null;

  const ratios = {
    balanced: { carbsPct: 50, fatsPct: 25, proteinsPct: 25 },
    keto: { carbsPct: 5, fatsPct: 75, proteinsPct: 20 },
    high_protein: { carbsPct: 30, fatsPct: 25, proteinsPct: 45 },
    low_carb: { carbsPct: 20, fatsPct: 45, proteinsPct: 35 },
    vegan: { carbsPct: 55, fatsPct: 25, proteinsPct: 20 },
    mediterranean: { carbsPct: 45, fatsPct: 35, proteinsPct: 20 },
    paleo: { carbsPct: 25, fatsPct: 40, proteinsPct: 35 },
  };

  const r = ratios[dietType] || ratios.balanced;
  return {
    ...r,
    carbsG: Math.round((dailyCalories * (r.carbsPct / 100)) / 4),
    fatsG: Math.round((dailyCalories * (r.fatsPct / 100)) / 9),
    proteinsG: Math.round((dailyCalories * (r.proteinsPct / 100)) / 4),
  };
}

function calculateWaterGoal(weightKg, gender) {
  if (!weightKg) return 2500;
  let base = Math.round(weightKg * 33);
  if (gender === 'male') base += 200;
  return Math.max(1500, Math.min(4000, Math.round(base / 100) * 100));
}

module.exports = {
  calculateBMI,
  calculateDailyCalories,
  calculateMacros,
  calculateWaterGoal,
};
