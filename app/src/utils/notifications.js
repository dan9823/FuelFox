import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions and get push token
 */
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'FuelFox',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'fuelfox',
    });
    return token.data;
  } catch {
    return null;
  }
}

/**
 * Schedule a daily meal logging reminder
 */
export async function scheduleMealReminder(hour = 12, minute = 0) {
  await cancelNotificationsByTag('meal_reminder');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to log your meal! 🦊',
      body: "Ember is hungry for data! Don't forget to log what you're eating.",
      data: { type: 'meal_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Schedule hydration reminders throughout the day
 */
export async function scheduleHydrationReminders() {
  await cancelNotificationsByTag('hydration');

  const hours = [9, 11, 13, 15, 17, 19];

  for (const hour of hours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Stay hydrated! 💧',
        body: [
          "Time for a glass of water! Your body will thank you.",
          "Hydration check! Have you had water recently?",
          "Water break! Even mild dehydration affects focus.",
          "Ember says: drink up! 🦊💧",
          "Quick reminder to grab some water!",
          "H2O time! Keep that hydration streak going.",
        ][hour % 6],
        data: { type: 'hydration' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  }
}

/**
 * Schedule a fasting start/end reminder
 */
export async function scheduleFastingReminder(startHour = 20, endHour = 12) {
  await cancelNotificationsByTag('fasting');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Fasting time! 🌙',
      body: "It's time to start your fast. Ember will keep you company!",
      data: { type: 'fasting_start' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: startHour,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Fast complete! 🎉',
      body: "You did it! Time to break your fast with a healthy meal.",
      data: { type: 'fasting_end' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: endHour,
      minute: 0,
    },
  });
}

/**
 * Schedule a streak motivation reminder (evening)
 */
export async function scheduleStreakReminder() {
  await cancelNotificationsByTag('streak');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't lose your streak! 🔥",
      body: "You haven't logged anything today. A quick entry keeps your streak alive!",
      data: { type: 'streak' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 30,
    },
  });
}

/**
 * Send an immediate notification
 */
export async function sendImmediateNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Send immediately
  });
}

/**
 * Cancel all scheduled notifications with a specific tag
 */
async function cancelNotificationsByTag(tag) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.type?.startsWith(tag)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get count of scheduled notifications
 */
export async function getScheduledNotificationCount() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}
