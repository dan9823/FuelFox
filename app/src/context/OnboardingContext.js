import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  calculateBMI,
  calculateDailyCalories,
  calculateMacros,
  calculateWaterGoal,
  calculateFastingHours,
  calculateEatingWindow,
} from '../utils/calculations';

const OnboardingContext = createContext(null);

const INITIAL_STATE = {
  // Survey & preferences
  referralSource: null,
  mainGoal: null,
  additionalGoals: [],
  calorieExperience: null,
  knowsFasting: null,
  dietType: null,
  foodRestrictions: [],
  eatingLocation: null,
  waterHabit: null,
  eatingChanges: [],

  // Personal info
  gender: null,
  age: null,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,

  // Eating schedule
  mealsPerDay: null,
  eatingWindowStart: null,
  eatingWindowEnd: null,

  // Activity
  activityLevel: null,

  // Pet
  foxName: '',

  // Reminders
  reminderPreferences: [],
};

export function OnboardingProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  const updateField = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, itemId) => {
    setState((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(itemId);
      return {
        ...prev,
        [field]: exists
          ? current.filter((id) => id !== itemId)
          : [...current, itemId],
      };
    });
  };

  const resetOnboarding = () => {
    setState(INITIAL_STATE);
  };

  // Computed values
  const computed = useMemo(() => {
    const { gender, age, heightCm, weightKg, activityLevel, mainGoal, dietType, eatingWindowStart, eatingWindowEnd } = state;

    const bmi = calculateBMI(weightKg, heightCm);

    const fastingHours = calculateFastingHours(eatingWindowStart, eatingWindowEnd);
    const eatingWindowHours = calculateEatingWindow(eatingWindowStart, eatingWindowEnd);

    const dailyCalories = calculateDailyCalories(
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      mainGoal
    );

    const macros = calculateMacros(dailyCalories, dietType);

    const waterGoalMl = calculateWaterGoal(weightKg, gender);

    return {
      bmi,
      fastingHours,
      eatingWindowHours,
      dailyCalories,
      macros,
      waterGoalMl,
    };
  }, [
    state.gender,
    state.age,
    state.heightCm,
    state.weightKg,
    state.activityLevel,
    state.mainGoal,
    state.dietType,
    state.eatingWindowStart,
    state.eatingWindowEnd,
  ]);

  const value = useMemo(
    () => ({
      ...state,
      ...computed,
      updateField,
      toggleArrayItem,
      resetOnboarding,
    }),
    [state, computed]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export default OnboardingContext;
