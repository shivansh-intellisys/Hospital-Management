import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Platform, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
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
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const validate = () => {
  const { name, age, gender, address, mobile, department } = form;

  if (
    name.trim() === '' ||
    age.trim() === '' ||
    gender.trim() === '' ||
    address.trim() === '' ||
    mobile.trim() === '' ||
    department.trim() === ''
  ) {
    Alert.alert('Validation Error', 'Please fill all required fields.');
    return false;
  }

  if (!/^\d{10}$/.test(mobile)) {
    Alert.alert('Validation Error', 'Mobile number must be exactly 10 digits.');
    return false;
  }

  return true;
};


  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const stored = await AsyncStorage.getItem('patients');
      const existing = stored ? JSON.parse(stored) : [];

      const newPatient = {
        id: existing.length + 1,
        ...form,
        name: capitalizeWords(form.name),
        date,
        time
      };

      const updatedList = [...existing, newPatient];
      await AsyncStorage.setItem('patients', JSON.stringify(updatedList));

      Alert.alert('Success', 'Patient added successfully!');
      setForm({ name: '', age: '', gender: '', address: '', mobile: '', email: '', department: '', doctor: '' });

    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Patient & Book Appointment</Text>

      <Text style={styles.label}>Patient Name *</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Age *</Text>
      <TextInput
        style={styles.input}
        value={form.age}
        keyboardType="numeric"
        onChangeText={(text) => handleChange('age', text)}
        placeholder="Enter age"
      />

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.input}>
        <RNPickerSelect
          onValueChange={(value) => handleChange('gender', value)}
          placeholder={{ label: 'Select Gender', value: '' }}
          value={form.gender}
          items={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
          ]}
          style={{ inputAndroid: styles.pickerInput,placeholder: { color: '#999' }, inputIOS: styles.pickerInput }}
        />
      </View>

      <Text style={styles.label}>Address *</Text>
      <TextInput
        style={styles.input}
        value={form.address}
        onChangeText={(text) => handleChange('address', text)}
        placeholder="Enter full address"
      />

      <Text style={styles.label}>Mobile Number *</Text>
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

      <Text style={styles.label}>Department *</Text>
      <View style={styles.input}>
        <RNPickerSelect
          onValueChange={(value) => handleChange('department', value)}
          placeholder={{ label: 'Select Department', value: '' }}
          value={form.department}
          items={[
            { label: 'Cardiology', value: 'Cardiology' },
            { label: 'Neurology', value: 'Neurology' },
            { label: 'Orthopedics', value: 'Orthopedics' },
            { label: 'Pediatrics', value: 'Pediatrics' },
          ]}
          style={{ inputAndroid: styles.pickerInput, placeholder: { color: '#999' }, inputIOS: styles.pickerInput }}
        />
      </View>

      <Text style={styles.label}>Doctor Name</Text>
      <TextInput
        style={styles.input}
        value={form.doctor}
        onChangeText={(text) => handleChange('doctor', text)}
        placeholder="Enter doctor name"
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
    marginBottom: 20,
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
  pickerInput: {
    fontSize: 15,
      
    paddingVertical: 10,
    paddingHorizontal: 4,
    color: COLORS.text,
    borderBlockColor:'none'
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
  dropdown: {
  backgroundColor: COLORS.card,
  borderRadius: 10,
  borderWidth: 0,
  borderColor: 'transparent',
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

  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
