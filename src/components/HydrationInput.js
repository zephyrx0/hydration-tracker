import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
// Pastikan untuk import Alert yang hilang jika diperlukan
// import { hydrationApi } from '../services/api'; // Hapus jika tidak digunakan

const HydrationInput = () => {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    // Validasi amount input
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);  // Set status menjadi submitting
    setError(null);  // Reset error jika ada

    try {
      // Kirim data hanya amount ke API menggunakan POST request
      const response = await axios.post('http://192.168.100.59:5000/api/hydration/add', {
        amount: parseInt(amount),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

      // Tampilkan pesan sukses jika berhasil
      Alert.alert('Success', 'Form submitted successfully!');
      console.log('Response:', response.data);

      // Reset form setelah submit berhasil
      setAmount('');
    } catch (err) {
      // Tangani error jika ada
      console.error('Error submitting form:', err);
      setError('Failed to submit form');
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setSubmitting(false);  // Reset status submitting setelah request selesai
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setError(null);
        }}
        placeholder="Enter water amount (ml)"
        keyboardType="numeric"
        editable={!submitting}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity 
        style={[styles.button, submitting && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Water</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#84c5f7',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});

export default HydrationInput;
