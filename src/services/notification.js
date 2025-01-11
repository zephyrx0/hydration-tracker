import * as Notifications from 'expo-notifications';

export const setupNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    return true;
  } catch (error) {
    console.error('Notification Setup Error:', error);
    return false;
  }
};

export const scheduleNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const intervals = [9, 11, 13, 15, 17, 19];
    
    for (const hour of intervals) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Hydrate!",
          body: "Don't forget to drink water and stay healthy.",
        },
        trigger: {
          hour: hour,
          minute: 0,
          repeats: true,
        },
      });
    }
  } catch (error) {
    console.error('Schedule Notification Error:', error);
  }
};
