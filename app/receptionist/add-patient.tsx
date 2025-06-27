import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Platform, Alert, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome5 } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AddPatient() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', age: '', gender: '', address: '',
    mobile: '', email: '', department: '', doctor: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const validate = () => {
    const requiredFields: Record<string, string> = {
      name: 'Patient Name', age: 'Age', gender: 'Gender',
      address: 'Address', mobile: 'Mobile Number', department: 'Department'
    };

    for (const key in requiredFields) {
      if (form[key as keyof typeof form].trim() === '') {
        Alert.alert('Validation Error', `${requiredFields[key]} is required.`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(form.mobile)) {
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
        time,
      };

      const updatedList = [...existing, newPatient];
      await AsyncStorage.setItem('patients', JSON.stringify(updatedList));

      Alert.alert('Success', 'Patient added successfully!', [
        { text: 'OK', onPress: () => router.replace('/receptionist/view-patient') }
      ]);

      setForm({ name: '', age: '', gender: '', address: '', mobile: '', email: '', department: '', doctor: '' });
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.Text entering={FadeInDown.duration(800)} style={styles.heading}>
          <FontAwesome5 name="user-plus" size={22} color={COLORS.primary} /> Add Patient & Book Appointment
        </Animated.Text>

        {renderInput('Patient Name', 'name', form.name, 'Enter full name', true, 'default', 'user')}
        {renderInput('Age', 'age', form.age, 'Enter age', true, 'numeric', 'calendar')}

        {renderPicker('Gender', 'gender', form.gender, true, [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ])}

        {renderInput('Address', 'address', form.address, 'Enter full address', true, 'default', 'map-marker-alt')}
        {renderInput('Mobile Number', 'mobile', form.mobile, 'Enter mobile number', true, 'phone-pad', 'phone')}
        {renderInput('Email', 'email', form.email, 'Enter email', false, 'email-address', 'envelope')}

        {renderPicker('Department', 'department', form.department, true, [
          { label: 'Cardiology', value: 'Cardiology' },
          { label: 'Neurology', value: 'Neurology' },
          { label: 'Orthopedics', value: 'Orthopedics' },
          { label: 'Pediatrics', value: 'Pediatrics' },
        ])}

        {renderInput('Doctor Name', 'doctor', form.doctor, 'Enter doctor name', false, 'default', 'user-md')}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit & Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  function renderInput(
    label: string,
    key: string,
    value: string,
    placeholder: string,
    required = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default',
    icon?: string
  ) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputBlock}>
        <Text style={styles.label}>{label} {required && <Text style={styles.required}>*</Text>}</Text>
        <View style={styles.inputIconWrapper}>
          {icon && <FontAwesome5 name={icon} size={16} color={COLORS.icon} style={styles.icon} />}
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
      </Animated.View>
    );
  }

  function renderPicker(label: string, key: string, value: string, required = false, items: any[]) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputBlock}>
        <Text style={styles.label}>{label} {required && <Text style={styles.required}>*</Text>}</Text>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(val) => handleChange(key, val)}
            placeholder={{ label: `Select ${label}`, value: '' }}
            value={value}
            items={items}
            style={pickerSelectStyles}
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: COLORS.text,
    fontWeight: '600',
  },
  required: {
    color: COLORS.danger,
    fontWeight: '900',
    fontSize: 16,
  },
  inputBlock: {
    marginBottom: 18,
  },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.text,
  },
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    backgroundColor: COLORS.card,
  },
  button: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '800',
    fontSize: 16,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    color: COLORS.text,
  },
  inputAndroid: {
    fontSize: 15,
    paddingVertical: 12,
    color: COLORS.text,
  },
  placeholder: {
    color: COLORS.placeholder,
  },
};
