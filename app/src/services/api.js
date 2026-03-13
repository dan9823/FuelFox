import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.fuelfox.app/api';

const TOKEN_KEY = '@fuelfox_token';
const USER_KEY = '@fuelfox_user';

let authToken = null;

async function loadToken() {
  if (!authToken) {
    authToken = await AsyncStorage.getItem(TOKEN_KEY);
  }
  return authToken;
}

async function saveToken(token) {
  authToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function clearToken() {
  authToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

async function request(endpoint, options = {}) {
  const token = await loadToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth
export async function register(provider, providerId, email, name) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ provider, providerId, email, name }),
  });
  await saveToken(data.token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function login(provider, providerId) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ provider, providerId }),
  });
  await saveToken(data.token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function completeOnboarding(userId, onboardingData) {
  return request('/auth/complete-onboarding', {
    method: 'POST',
    body: JSON.stringify({ userId, onboardingData }),
  });
}

export { clearToken as logout };

// User
export async function getProfile() {
  return request('/user/profile');
}

export async function updateGoals(goals) {
  return request('/user/goals', {
    method: 'PUT',
    body: JSON.stringify(goals),
  });
}

export async function getUserStats() {
  return request('/user/stats');
}

// Meals
export async function getTodayLog() {
  return request('/meals/today');
}

export async function getMealHistory(days = 7) {
  return request(`/meals/history?days=${days}`);
}

export async function logMeal(meal) {
  return request('/meals/log', {
    method: 'POST',
    body: JSON.stringify(meal),
  });
}

export async function deleteMeal(mealId) {
  return request(`/meals/${mealId}`, { method: 'DELETE' });
}

export async function logWeight(weight) {
  return request('/meals/weight', {
    method: 'POST',
    body: JSON.stringify({ weight }),
  });
}

// Water
export async function addWater(amountMl) {
  return request('/water/add', {
    method: 'POST',
    body: JSON.stringify({ amountMl }),
  });
}

export async function getWaterToday() {
  return request('/water/today');
}

// Fasting
export async function startFasting() {
  return request('/fasting/start', { method: 'POST' });
}

export async function stopFasting() {
  return request('/fasting/stop', { method: 'POST' });
}

export async function getFastingStatus() {
  return request('/fasting/status');
}

// Challenges
export async function getChallenges() {
  return request('/challenges');
}

export async function completeChallenge(challengeId) {
  return request(`/challenges/${challengeId}/complete`, { method: 'POST' });
}

// Meal Plan
export async function getMealPlan() {
  return request('/meal-plan');
}

export async function regenerateMealPlan() {
  return request('/meal-plan/regenerate', { method: 'POST' });
}

// Food Analysis
export async function analyzeMealPhoto(imageUri) {
  const token = await loadToken();
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'meal.jpg',
  });

  const response = await fetch(`${BASE_URL}/analyze/meal`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze meal photo');
  }
  return response.json();
}

export async function analyzeLabelPhoto(imageUri) {
  const token = await loadToken();
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'label.jpg',
  });

  const response = await fetch(`${BASE_URL}/analyze/label`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze label photo');
  }
  return response.json();
}

export async function searchFood(query) {
  return request('/analyze/text', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

// Health check
export async function healthCheck() {
  try {
    const data = await request('/health');
    return data.status === 'ok';
  } catch {
    return false;
  }
}
