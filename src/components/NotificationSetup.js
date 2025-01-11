// NotificationSetup.js
import React from 'react';
import { StyleSheet, View, Switch, Text, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // Disable sound to prevent immediate notification
    shouldSetBadge: false,
  }),
});

const NotificationSetup = ({ enabled = false, onToggle }) => {
  const handleToggle = async (value) => {
    try {
      if (typeof onToggle !== 'function') {
        console.error('onToggle prop is not a function');
        return;
      }

      if (value) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to use this feature.',
            [{ text: 'OK' }]
          );
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('hydration-reminders', {
            name: 'Hydration Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: false, // Disable sound for the channel
          });
        }

        // Check and schedule next valid notification
        const nextValidTime = await findNextValidTime();
        if (nextValidTime) {
          await scheduleInitialNotification(nextValidTime);
          // Alert.alert(
          //   'Notifications Enabled',
          //   `Your first hydration reminder will be at ${formatTime(nextValidTime)}`,
          //   [{ text: 'OK' }]
          // );
        }
      } else {
        await cancelAllNotifications();
      }
      
      onToggle(value);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to set up notifications. Please try again.');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const findNextValidTime = async () => {
    const now = new Date();
    const times = [
      { hour: 8, minute: 0 },
      { hour: 10, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 16, minute: 0 },
      { hour: 18, minute: 0 },
      { hour: 20, minute: 0 },
      { hour: 22, minute: 0 }
    ];

    const MINIMUM_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds
    const currentTimestamp = now.getTime();

    // Find next valid time
    for (const time of times) {
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        time.hour,
        time.minute,
        0,
        0
      );

      const timeUntilScheduled = scheduledTime.getTime() - currentTimestamp;

      // Only consider times that are at least MINIMUM_DELAY minutes in the future
      if (timeUntilScheduled >= MINIMUM_DELAY) {
        console.log(`Found valid time: ${formatTime(scheduledTime)}`);
        return scheduledTime;
      }
    }

    // If no valid times today, schedule for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTime = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      times[0].hour,
      times[0].minute,
      0,
      0
    );

    console.log(`Scheduling for tomorrow: ${formatTime(tomorrowTime)}`);
    return tomorrowTime;
  };

  const scheduleInitialNotification = async (scheduledTime) => {
    try {
      // Cancel any existing notifications first
      await cancelAllNotifications();

      const trigger = {
        date: scheduledTime,
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Hydrate! 💧",
          body: "Don't forget to drink water and stay healthy!",
          sound: true,
        },
        trigger,
      });

      console.log(`Scheduled notification for ${formatTime(scheduledTime)}, ID: ${identifier}`);

      // Schedule next notification after this one triggers
      Notifications.addNotificationReceivedListener(async () => {
        if (enabled) {
          const nextTime = await findNextValidTime();
          if (nextTime) {
            await scheduleInitialNotification(nextTime);
          }
        }
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Daily Reminders</Text>
          <Text style={styles.description}>
            Receive 8 reminders throughout the day (8 AM - 10 PM)
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={enabled ? '#2196F3' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationSetup;