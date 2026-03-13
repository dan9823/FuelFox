/**
 * Calculate BMI from weight (kg) and height (cm).
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {number} BMI rounded to 1 decimal
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category, color, and description.
 * @param {number} bmi
 * @returns {{ label: string, color: string, description: string }}
 */
export function getBMICategory(bmi) {
  if (bmi <= 0) {
    return { label: 'Unknown', color: '#9E9E9E', description: 'Enter your details to see your BMI' };
  }
  if (bmi < 18.5) {
    return { label: 'Underweight', color: '#42A5F5', description: 'You may benefit from gaining some weight for better health.' };
  }
  if (bmi < 25) {
    return { label: 'Normal', color: '#E8813A', description: 'Great job! Your weight is within a healthy range.' };
  }
  if (bmi < 30) {
    return { label: 'Overweight', color: '#FF9800', description: 'A modest weight loss could improve your health markers.' };
  }
  return { label: 'Obese', color: '#EF5353', description: 'Working towards a healthier weight can significantly benefit you.' };
}

/**
 * Calculate daily calorie needs using the Mifflin-St Jeor equation.
 *
 * @param {string} gender - 'male', 'female', or 'nonbinary'
 * @param {number} age - years
 * @param {number} heightCm
 * @param {number} weightKg
 * @param {string} activityLevel - 'sedentary' | 'light' | 'moderate' | 'active'
 * @param {string} goal - 'lose' | 'maintain' | 'gain'
 * @returns {number} daily calories (rounded to nearest 10)
 */
export function calculateDailyCalories(gender, age, heightCm, weightKg, activityLevel, goal) {
  if (!gender || !age || !heightCm || !weightKg) return 2000;

  // Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Non-binary: average of male and female formulas
    const maleBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    const femaleBmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    bmr = (maleBmr + femaleBmr) / 2;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  let tdee = bmr * multiplier;

  // Goal adjustments
  if (goal === 'lose') {
    tdee -= 500; // ~0.45 kg/week deficit
  } else if (goal === 'gain') {
    tdee += 300; // lean bulk surplus
  }

  // Clamp to reasonable range
  tdee = Math.max(1200, Math.min(4500, tdee));

  return Math.round(tdee / 10) * 10;
}

/**
 * Calculate macro breakdown in grams and percentages.
 *
 * @param {number} calories - daily calorie target
 * @param {string} dietType - 'balanced' | 'vegetarian' | 'vegan' | 'paleo' | 'keto' | 'high_protein' | 'low_carb'
 * @returns {{ carbsG: number, fatsG: number, proteinsG: number, carbsPct: number, fatsPct: number, proteinsPct: number }}
 */
export function calculateMacros(calories, dietType) {
  if (!calories || calories <= 0) {
    return { carbsG: 0, fatsG: 0, proteinsG: 0, carbsPct: 0, fatsPct: 0, proteinsPct: 0 };
  }

  // Macro ratios by diet type (carbs%, fat%, protein%)
  const ratios = {
    balanced:     { carbs: 0.50, fat: 0.25, protein: 0.25 },
    vegetarian:   { carbs: 0.55, fat: 0.25, protein: 0.20 },
    vegan:        { carbs: 0.55, fat: 0.25, protein: 0.20 },
    paleo:        { carbs: 0.30, fat: 0.35, protein: 0.35 },
    keto:         { carbs: 0.05, fat: 0.70, protein: 0.25 },
    high_protein: { carbs: 0.35, fat: 0.25, protein: 0.40 },
    low_carb:     { carbs: 0.20, fat: 0.45, protein: 0.35 },
  };

  const r = ratios[dietType] || ratios.balanced;

  const carbsG = Math.round((calories * r.carbs) / 4);     // 4 cal per gram carbs
  const fatsG = Math.round((calories * r.fat) / 9);        // 9 cal per gram fat
  const proteinsG = Math.round((calories * r.protein) / 4); // 4 cal per gram protein

  return {
    carbsG,
    fatsG,
    proteinsG,
    carbsPct: Math.round(r.carbs * 100),
    fatsPct: Math.round(r.fat * 100),
    proteinsPct: Math.round(r.protein * 100),
  };
}

/**
 * Calculate daily water intake goal in ml.
 * General rule: ~33 ml per kg of body weight, slightly more for males.
 *
 * @param {number} weightKg
 * @param {string} gender - 'male' | 'female' | 'nonbinary'
 * @returns {number} water goal in ml (rounded to nearest 100)
 */
export function calculateWaterGoal(weightKg, gender) {
  if (!weightKg || weightKg <= 0) return 2000;

  let mlPerKg = 33;
  if (gender === 'male') mlPerKg = 35;
  if (gender === 'female') mlPerKg = 31;

  const goal = weightKg * mlPerKg;
  // Clamp between 1500 and 5000
  const clamped = Math.max(1500, Math.min(5000, goal));
  return Math.round(clamped / 100) * 100;
}

/**
 * Calculate fasting hours from start and end time strings.
 * Fasting hours = 24 - eating window hours.
 *
 * @param {string} startTime - e.g. "8:00 AM"
 * @param {string} endTime - e.g. "8:00 PM"
 * @returns {number} fasting hours
 */
export function calculateFastingHours(startTime, endTime) {
  const eatingWindow = calculateEatingWindow(startTime, endTime);
  return 24 - eatingWindow;
}

/**
 * Calculate eating window hours from start and end time strings.
 *
 * @param {string} startTime - e.g. "8:00 AM"
 * @param {string} endTime - e.g. "8:00 PM"
 * @returns {number} eating window in hours
 */
export function calculateEatingWindow(startTime, endTime) {
  if (!startTime || !endTime) return 12;

  const toHours = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours + minutes / 60;
  };

  const start = toHours(startTime);
  const end = toHours(endTime);

  let diff = end - start;
  if (diff < 0) diff += 24; // handles overnight eating windows
  if (diff === 0) diff = 12; // default if same

  return Math.round(diff);
}

/**
 * Generate a readable calorie summary string.
 *
 * @param {number} consumed
 * @param {number} goal
 * @returns {string}
 */
export function getCalorieSummary(consumed, goal) {
  const remaining = goal - consumed;
  if (remaining > 0) {
    return `${remaining} cal remaining`;
  }
  if (remaining === 0) {
    return 'Goal reached!';
  }
  return `${Math.abs(remaining)} cal over goal`;
}

/**
 * Get today's date as YYYY-MM-DD string.
 * @returns {string}
 */
export function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}
