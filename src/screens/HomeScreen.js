import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HydrationInput from '../components/HydrationInput';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jangan Lupa Minum Rek</Text>
      <HydrationInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
