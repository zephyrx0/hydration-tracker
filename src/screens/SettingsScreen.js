// SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationSetup from '../components/NotificationSetup';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'notificationSettings';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved notification state and check actual notification permissions
  useEffect(() => {
    loadNotificationState();
  }, []);

  const loadNotificationState = async () => {
    try {
      setIsLoading(true);
      
      // Load saved preference from storage
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      const savedEnabled = savedState ? JSON.parse(savedState) : false;
      
      // Check actual notification permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      // If permissions were revoked but notifications are saved as enabled,
      // update the saved state to reflect reality
      if (savedEnabled && existingStatus !== 'granted') {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(false));
        setNotificationsEnabled(false);
      } else {
        setNotificationsEnabled(savedEnabled);
      }

      // Check for any existing scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // If notifications are enabled but none are scheduled, reschedule them
      if (savedEnabled && existingStatus === 'granted' && scheduledNotifications.length === 0) {
        // Trigger a toggle off and on to reschedule notifications
        await handleToggleNotification(false);
        await handleToggleNotification(true);
      }
      
    } catch (error) {
      console.error('Error loading notification state:', error);
      setNotificationsEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      setNotificationsEnabled(value);
      
      // If turning off, ensure all notifications are cancelled
      if (!value) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error saving notification state:', error);
      // Revert the state if there was an error
      setNotificationsEnabled(!value);
    }
  };

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <View style={styles.container}>
      <NotificationSetup 
        enabled={notificationsEnabled}
        onToggle={handleToggleNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default SettingsScreen;