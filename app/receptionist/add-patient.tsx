import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import COLORS from '@/constants/Colors';

export default function AddPatient() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    mobile: '',
    email: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log('Patient & Appointment Details:', form);
    // You can send this data to backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Patient & Book Appointment</Text>

      {/* Patient Info */}
      <Text style={styles.label}>Patient Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={form.age}
        keyboardType="numeric"
        onChangeText={(text) => handleChange('age', text)}
        placeholder="Enter age"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={form.gender}
        onChangeText={(text) => handleChange('gender', text)}
        placeholder="Male / Female / Other"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={form.address}
        onChangeText={(text) => handleChange('address', text)}
        placeholder="Enter full address"
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={form.mobile}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('mobile', text)}
        placeholder="Enter mobile number"
      />

      <Text style={styles.label}>Email (Optional)</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Enter email"
      />

      {/* Appointment Info */}
      <Text style={styles.label}>Department</Text>
      <TextInput
        style={styles.input}
        value={form.department}
        onChangeText={(text) => handleChange('department', text)}
        placeholder="e.g. Cardiology, Neurology"
      />

      <Text style={styles.label}>Doctor Name</Text>
      <TextInput
        style={styles.input}
        value={form.doctor}
        onChangeText={(text) => handleChange('doctor', text)}
        placeholder="Enter doctor name"
      />

      <Text style={styles.label}>Appointment Date</Text>
      <TextInput
        style={styles.input}
        value={form.date}
        onChangeText={(text) => handleChange('date', text)}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        value={form.time}
        onChangeText={(text) => handleChange('time', text)}
        placeholder="HH:MM AM/PM"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit & Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  button: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
