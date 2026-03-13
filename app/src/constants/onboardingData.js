export const referralSources = [
  { id: 'influencer', emoji: '🌟', label: 'From influencer' },
  { id: 'instagram', emoji: '📸', label: 'Instagram' },
  { id: 'tiktok', emoji: '🎵', label: 'TikTok' },
  { id: 'youtube', emoji: '▶️', label: 'Youtube' },
  { id: 'appstore', emoji: '🔍', label: 'App Store search' },
  { id: 'friends', emoji: '👫', label: 'Friends/family' },
];

export const mainGoals = [
  { id: 'lose', emoji: '⬇️', label: 'Lose weight' },
  { id: 'maintain', emoji: '⚖️', label: 'Maintain weight' },
  { id: 'gain', emoji: '⬆️', label: 'Gain weight' },
];

export const additionalGoals = [
  { id: 'healthy_relationship', emoji: '💚', label: 'Build healthy relationship with food' },
  { id: 'wellbeing', emoji: '🌿', label: 'Improve overall wellbeing' },
  { id: 'energy', emoji: '⚡', label: 'Boost daily energy' },
  { id: 'gut_health', emoji: '🦠', label: 'Improve gut health' },
  { id: 'feel_better', emoji: '😊', label: 'Feel better about myself' },
  { id: 'sport', emoji: '🏋️', label: 'Improve sport performance' },
  { id: 'stress', emoji: '🧘', label: 'Reduce stress' },
  { id: 'nutrition', emoji: '📚', label: 'Learn more about nutrition' },
];

export const calorieCountingExperience = [
  { id: 'new', emoji: '🌱', label: "I'm new to calorie counting" },
  { id: 'tried', emoji: '🔄', label: "I've tried it before but quit" },
  { id: 'current', emoji: '✅', label: "I'm currently counting" },
];

export const dietTypes = [
  { id: 'balanced', emoji: '🍽️', label: 'Balanced' },
  { id: 'vegetarian', emoji: '🥬', label: 'Vegetarian' },
  { id: 'vegan', emoji: '🌱', label: 'Vegan' },
  { id: 'paleo', emoji: '🥩', label: 'Paleo' },
  { id: 'keto', emoji: '🥑', label: 'Ketogenic' },
  { id: 'high_protein', emoji: '💪', label: 'High protein' },
  { id: 'low_carb', emoji: '🥗', label: 'Low carb' },
];

export const foodRestrictions = [
  { id: 'all_meat', label: 'All meat' },
  { id: 'animal_products', label: 'Animal products' },
  { id: 'citrus', label: 'Citrus fruits' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'red_meat', label: 'Red meat' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'soy', label: 'Soy' },
];

export const eatingLocations = [
  { id: 'cook', emoji: '🏠', label: 'Cook at home' },
  { id: 'delivery', emoji: '🛵', label: 'Order delivery' },
  { id: 'eat_out', emoji: '🍽️', label: 'Eat out' },
];

export const waterHabits = [
  { id: 'yes', emoji: '💧', label: 'Yes' },
  { id: 'no', emoji: '🚫', label: 'No' },
  { id: 'not_sure', emoji: '🤔', label: 'Not sure' },
];

export const eatingHabitChanges = [
  { id: 'reduce_sugar', emoji: '🍬', label: 'Reduce sugar intake' },
  { id: 'less_junk', emoji: '🍔', label: 'Eat less junk food' },
  { id: 'stop_binge', emoji: '🛑', label: 'Stop binge eating' },
  { id: 'more_greens', emoji: '🥦', label: 'Eat more greens & veggies' },
  { id: 'stop_stress_eating', emoji: '😤', label: 'Stop stress overeating' },
  { id: 'cook_more', emoji: '👩‍🍳', label: 'Cook at home more often' },
  { id: 'reduce_salt', emoji: '🧂', label: 'Reduce salt intake' },
];

export const activityLevels = [
  {
    id: 'sedentary',
    emoji: '🛋️',
    label: 'Not active',
    description: 'I quickly lose my breath climbing stairs',
  },
  {
    id: 'light',
    emoji: '🚶',
    label: 'Lightly active',
    description: 'Sometimes I do short workouts to keep myself moving',
  },
  {
    id: 'moderate',
    emoji: '🏃',
    label: 'Moderately active',
    description: 'I maintain a regular exercise routine of 1-2 times per week',
  },
  {
    id: 'active',
    emoji: '🏋️',
    label: 'Highly active',
    description: 'Fitness is a core part of my lifestyle',
  },
];

export const genders = [
  { id: 'female', emoji: '👩', label: 'Female' },
  { id: 'male', emoji: '👨', label: 'Male' },
  { id: 'nonbinary', emoji: '🧑', label: 'Non-binary' },
];

export const reminderOptions = [
  { id: 'morning', emoji: '🌅', label: 'In the morning' },
  { id: 'before_meals', emoji: '🍽️', label: 'Before all meals' },
  { id: 'pet_hungry', emoji: '🦝', label: 'When pet is hungry' },
];

export const onboardingCarouselPages = [
  {
    title: 'Track calories',
    subtitle: 'Just snap a photo and let AI do the rest',
    key: 'track',
  },
  {
    title: 'Stay hydrated',
    subtitle: 'Easily track your water and hit your goals',
    key: 'hydrate',
  },
  {
    title: 'Enjoy fasting',
    subtitle: "Build a healthy habit that you'll actually enjoy",
    key: 'fasting',
  },
  {
    title: 'See results',
    subtitle: 'Watch your progress and celebrate every win',
    key: 'results',
  },
  {
    title: 'Feel the love',
    subtitle: 'Your virtual buddy supports your healthy choices',
    key: 'pet',
  },
];

export const mealsPerDayOptions = [
  { id: '2', emoji: '🍽️', label: '2 meals' },
  { id: '3', emoji: '🍽️', label: '3 meals' },
  { id: '4', emoji: '🍽️', label: '4 meals' },
  { id: '5', emoji: '🍽️', label: '5+ meals' },
];

export const eatingWindowOptions = {
  startTimes: [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM',
  ],
  endTimes: [
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
    '10:00 PM', '11:00 PM',
  ],
};
