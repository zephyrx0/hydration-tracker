import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SegmentedControl } from 'react-native';
import StatisticsChart from '../components/StatisticsChart';
import { api } from '../services/api';

const StatisticsScreen = () => {
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hydrationData, setHydrationData] = useState([]);

  const fetchHydrationData = async () => {
    try {
      setLoading(true);
      const response = await api.getHydrationLogs(period);
      if (response.data) {
        setHydrationData(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load hydration data');
      console.error('Error fetching hydration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHydrationData();
  }, [period]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['Daily', 'Weekly', 'Monthly']}
        selectedIndex={['daily', 'weekly', 'monthly'].indexOf(period)}
        onChange={(event) => {
          setPeriod(['daily', 'weekly', 'monthly'][event.nativeEvent.selectedSegmentIndex]);
        }}
        style={styles.segmentedControl}
      />
      <StatisticsChart data={hydrationData} period={period} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  }
});

export default StatisticsScreen;
