// File: app/receptionist/generate-bill.tsx

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import COLORS from '@/constants/Colors';

export default function GenerateBill() {
  const patient = {
    id: 'P123456',
    name: 'Ravi Sharma',
    address: 'A-42, Gomti Nagar, Lucknow',
    mobile: '9876543210',
  };

  const bill = {
    billId: 'BILL-0098',
    gstNo: '09ABCDE1234F1Z2',
    amount: '',
  };

  const handleGeneratePDF = () => {
    Alert.alert('PDF generation not implemented', 'You can add this later using Expo Print or PDFLib.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate Bill</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🧑 Patient Information</Text>
        <Text style={styles.label}>Patient ID: <Text style={styles.value}>{patient.id}</Text></Text>
        <Text style={styles.label}>Name: <Text style={styles.value}>{patient.name}</Text></Text>
        <Text style={styles.label}>Address: <Text style={styles.value}>{patient.address}</Text></Text>
        <Text style={styles.label}>Mobile: <Text style={styles.value}>{patient.mobile}</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🧾 Billing Details</Text>
        <Text style={styles.label}>Bill ID: <Text style={styles.value}>{bill.billId}</Text></Text>
        <Text style={styles.label}>GST No: <Text style={styles.value}>{bill.gstNo}</Text></Text>

        <Text style={styles.label}>Amount (₹):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter total amount"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
        <Text style={styles.buttonText}>Generate PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.secondary,
  },
  label: {
    fontSize: 14,
    marginTop: 6,
    color: COLORS.text,
  },
  value: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.buttonText || '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
