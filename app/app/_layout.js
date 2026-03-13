import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { OnboardingProvider } from '../src/context/OnboardingContext';
import { AppProvider } from '../src/context/AppContext';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Listen for notification interactions
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      // Handle notification tap based on type
      console.log('Notification tapped:', data?.type);
    });
    return () => subscription.remove();
  }, []);
  return (
    <OnboardingProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F5F4F8' },
          }}
        >
          {/* Splash / entry */}
          <Stack.Screen name="index" />

          {/* Pre-onboarding */}
          <Stack.Screen name="welcome" />
          <Stack.Screen name="onboarding-carousel" />

          {/* Onboarding survey flow */}
          <Stack.Screen name="onboarding/referral" />
          <Stack.Screen name="onboarding/main-goal" />
          <Stack.Screen name="onboarding/additional-goals" />
          <Stack.Screen name="onboarding/long-term-results" />
          <Stack.Screen name="onboarding/calorie-experience" />
          <Stack.Screen name="onboarding/why-fuelfox-works" />
          <Stack.Screen name="onboarding/fasting-knowledge" />
          <Stack.Screen name="onboarding/fasting-info" />
          <Stack.Screen name="onboarding/meet-pet" />
          <Stack.Screen name="onboarding/pet-reveal" />
          <Stack.Screen name="onboarding/name-pet" />
          <Stack.Screen name="onboarding/rating-page" />
          <Stack.Screen name="onboarding/reminder-support" />
          <Stack.Screen name="onboarding/reminder-preferences" />
          <Stack.Screen name="onboarding/eating-habits-intro" />
          <Stack.Screen name="onboarding/meals-per-day" />
          <Stack.Screen name="onboarding/eating-window" />
          <Stack.Screen name="onboarding/fasting-result" />
          <Stack.Screen name="onboarding/where-eat" />
          <Stack.Screen name="onboarding/diet-type" />
          <Stack.Screen name="onboarding/food-restrictions" />
          <Stack.Screen name="onboarding/water-habit" />
          <Stack.Screen name="onboarding/water-info" />
          <Stack.Screen name="onboarding/eating-changes" />
          <Stack.Screen name="onboarding/goals-confirmation" />
          <Stack.Screen name="onboarding/gender-select" />
          <Stack.Screen name="onboarding/age-select" />
          <Stack.Screen name="onboarding/activity-level" />
          <Stack.Screen name="onboarding/height-select" />
          <Stack.Screen name="onboarding/current-weight" />
          <Stack.Screen name="onboarding/personal-summary" />
          <Stack.Screen name="onboarding/target-weight" />
          <Stack.Screen name="onboarding/realistic-target" />
          <Stack.Screen name="onboarding/personalizing-plan" />
          <Stack.Screen name="onboarding/personal-plan-ready" />
          <Stack.Screen name="onboarding/paywall" />
          <Stack.Screen name="onboarding/create-account" />
          <Stack.Screen name="onboarding/meal-plan-intro" />

          {/* Main tabs */}
          <Stack.Screen
            name="(tabs)"
            options={{ gestureEnabled: false }}
          />

          {/* Stack screens pushed from tabs */}
          <Stack.Screen
            name="settings"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="home-layout"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="food-journal"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="quick-log"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="notifications"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="camera"
            options={{
              animation: 'slide_from_bottom',
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen
            name="analysis-results"
            options={{ animation: 'slide_from_right' }}
          />
        </Stack>
      </AppProvider>
    </OnboardingProvider>
  );
}
