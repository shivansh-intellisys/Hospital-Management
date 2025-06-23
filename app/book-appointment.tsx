import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function BookAppointment() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book Appointment</Text>
      <Button title="Book Now" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
});