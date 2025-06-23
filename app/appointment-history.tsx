import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Appointment History</Text>
      <Text>No previous appointments.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
});