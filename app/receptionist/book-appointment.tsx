import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import COLORS from '@/constants/Colors';

export default function AddPatientScreen() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    mobile: '',
    email: '',
    note: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    const { name, age, gender, address, mobile } = form;

    if (!name || !age || !gender || !address || !mobile) {
      Alert.alert('Please fill all required fields!');
      return;
    }

    console.log('Submitted Patient Info:', form);
    Alert.alert('Patient added successfully!');
    // Reset
    setForm({
      name: '',
      age: '',
      gender: '',
      address: '',
      mobile: '',
      email: '',
      note: '',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New Patient</Text>

        <TextInput
          placeholder="Full Name"
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
          style={styles.input}
        />
        <TextInput
          placeholder="Age"
          value={form.age}
          keyboardType="numeric"
          onChangeText={(val) => handleChange('age', val)}
          style={styles.input}
        />
        <TextInput
          placeholder="Gender (e.g. Male / Female / Other)"
          value={form.gender}
          onChangeText={(val) => handleChange('gender', val)}
          style={styles.input}
        />
        <TextInput
          placeholder="Address"
          value={form.address}
          onChangeText={(val) => handleChange('address', val)}
          style={styles.input}
          multiline
        />
        <TextInput
          placeholder="Mobile Number"
          value={form.mobile}
          keyboardType="phone-pad"
          onChangeText={(val) => handleChange('mobile', val)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email (optional)"
          value={form.email}
          keyboardType="email-address"
          onChangeText={(val) => handleChange('email', val)}
          style={styles.input}
        />
        <TextInput
          placeholder="Additional Note (optional)"
          value={form.note}
          onChangeText={(val) => handleChange('note', val)}
          style={styles.input}
          multiline
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.btnText}>Add Patient</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
