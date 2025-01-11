import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const StatisticsChart = ({ data, period }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Consumption</Text>
      <View style={styles.chartContainer}>
        {/* Chart implementation will be added later */}
        <Text>Statistics for {period}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default StatisticsChart;
