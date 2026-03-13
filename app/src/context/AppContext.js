import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getTodayString } from '../utils/calculations';

const AppContext = createContext(null);

function createEmptyDailyLog(date) {
  return {
    date: date || getTodayString(),
    calories: 0,
    carbs: 0,
    fats: 0,
    proteins: 0,
    meals: [],
    waterMl: 0,
    fastingStartTime: null,
    fastingEndTime: null,
    weight: null,
    mood: null,
  };
}

const INITIAL_STATE = {
  user: {
    name: '',
    email: '',
    foxName: '',
    petName: 'Ember',
  },
  dailyLog: createEmptyDailyLog(),
  goals: {
    calories: 2000,
    carbsG: 250,
    fatsG: 56,
    proteinsG: 125,
    waterMl: 2500,
    fastingHours: 16,
    targetWeight: null,
  },
  streak: 0,
  coins: 0,
  challenges: {
    daily: [],
    weekly: [],
  },
  mealPlan: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  // Ensure daily log is for today, reset if date changed
  const ensureTodayLog = useCallback(() => {
    const today = getTodayString();
    setState((prev) => {
      if (prev.dailyLog.date !== today) {
        return {
          ...prev,
          dailyLog: createEmptyDailyLog(today),
          streak: prev.dailyLog.calories > 0 ? prev.streak + 1 : prev.streak,
        };
      }
      return prev;
    });
  }, []);

  const setUser = useCallback((userData) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
    }));
  }, []);

  const setGoals = useCallback((goals) => {
    setState((prev) => ({
      ...prev,
      goals: { ...prev.goals, ...goals },
    }));
  }, []);

  const addMeal = useCallback((meal) => {
    // meal: { name, calories, carbs, fats, proteins, time, type }
    setState((prev) => {
      const updatedMeals = [...prev.dailyLog.meals, {
        id: Date.now().toString(),
        ...meal,
        time: meal.time || new Date().toISOString(),
      }];

      return {
        ...prev,
        dailyLog: {
          ...prev.dailyLog,
          meals: updatedMeals,
          calories: prev.dailyLog.calories + (meal.calories || 0),
          carbs: prev.dailyLog.carbs + (meal.carbs || 0),
          fats: prev.dailyLog.fats + (meal.fats || 0),
          proteins: prev.dailyLog.proteins + (meal.proteins || 0),
        },
      };
    });
  }, []);

  const addWater = useCallback((amountMl) => {
    setState((prev) => ({
      ...prev,
      dailyLog: {
        ...prev.dailyLog,
        waterMl: prev.dailyLog.waterMl + amountMl,
      },
    }));
  }, []);

  const startFasting = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dailyLog: {
        ...prev.dailyLog,
        fastingStartTime: new Date().toISOString(),
        fastingEndTime: null,
      },
    }));
  }, []);

  const stopFasting = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dailyLog: {
        ...prev.dailyLog,
        fastingEndTime: new Date().toISOString(),
      },
    }));
  }, []);

  const logWeight = useCallback((weightKg) => {
    setState((prev) => ({
      ...prev,
      dailyLog: {
        ...prev.dailyLog,
        weight: weightKg,
      },
    }));
  }, []);

  const logMood = useCallback((mood) => {
    setState((prev) => ({
      ...prev,
      dailyLog: {
        ...prev.dailyLog,
        mood,
      },
    }));
  }, []);

  const earnCoins = useCallback((amount) => {
    setState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const setMealPlan = useCallback((meals) => {
    setState((prev) => ({
      ...prev,
      mealPlan: meals,
    }));
  }, []);

  const setChallenges = useCallback((challenges) => {
    setState((prev) => ({
      ...prev,
      challenges: { ...prev.challenges, ...challenges },
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ensureTodayLog,
      setUser,
      setGoals,
      addMeal,
      addWater,
      startFasting,
      stopFasting,
      logWeight,
      logMood,
      earnCoins,
      setMealPlan,
      setChallenges,
    }),
    [
      state,
      ensureTodayLog,
      setUser,
      setGoals,
      addMeal,
      addWater,
      startFasting,
      stopFasting,
      logWeight,
      logMood,
      earnCoins,
      setMealPlan,
      setChallenges,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
