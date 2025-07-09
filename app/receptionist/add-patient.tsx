import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Platform, Alert, Modal, FlatList, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AddPatient() {
  const router = useRouter();
  const [showDeptModal, setShowDeptModal] = useState(false);

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'ENT'];

  const [form, setForm] = useState({
    name: '', age: '', gender: '', address: '',
    mobile: '', email: '', department: '', doctor: '',
  });

  const [errors, setErrors] = useState({
    mobile: '', email: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });

    if (key === 'mobile') {
      if (!/^\d{10}$/.test(value)) {
        setErrors((e) => ({ ...e, mobile: 'Mobile must be 10 digits.' }));
      } else {
        checkDuplicate('mobile', value);
      }
    }

    if (key === 'email') {
      if (value.length > 0 && !/^\S+@\S+\.\S+$/.test(value)) {
        setErrors((e) => ({ ...e, email: 'Invalid email format.' }));
      } else {
        checkDuplicate('email', value);
      }
    }
  };

  const checkDuplicate = async (key: 'email' | 'mobile', value: string) => {
    const stored = await AsyncStorage.getItem('patients');
    const patients = stored ? JSON.parse(stored) : [];

    if (patients.some((p: any) => p[key] === value)) {
      setErrors((e) => ({ ...e, [key]: `This ${key} already exists.` }));
    } else {
      setErrors((e) => ({ ...e, [key]: '' }));
    }
  };

  const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  const validateForm = () => {
    if (!form.name || !form.age || !form.gender || !form.address || !form.mobile || !form.department) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return false;
    }

    if (errors.mobile || errors.email) {
      Alert.alert('Fix Errors', 'Please resolve all errors before submitting.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const now = new Date();
    const date = now?.toISOString()?.split?.('T')?.[0] ?? '';
    const time = now?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';

    const newPatient = {
      id: Date.now(),
      ...form,
      name: capitalizeWords(form.name),
      date,
      time,
      status: 'pending',
      visitHistory: [
        {
          id: Date.now().toString(),
          date,
          time,
          department: form.department,
          doctor: form.doctor || '',
          status: 'pending'
        }
      ]
    };

    const stored = await AsyncStorage.getItem('patients');
    const existingPatients = stored ? JSON.parse(stored) : [];

    const updatedList = [...existingPatients, newPatient];
    await AsyncStorage.setItem('patients', JSON.stringify(updatedList));

    // Also update today's appointments
    const apptData = await AsyncStorage.getItem('appointments');
    const appointments = apptData ? JSON.parse(apptData) : [];
    appointments.push(newPatient);
    await AsyncStorage.setItem('appointments', JSON.stringify(appointments));

    Alert.alert('Success', 'Patient added successfully!', [
      { text: 'OK', onPress: () => router.replace('/receptionist/today-appointments') }
    ]);

    setForm({ name: '', age: '', gender: '', address: '', mobile: '', email: '', department: '', doctor: '' });
    setErrors({ mobile: '', email: '' });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.Text entering={FadeInDown.duration(800)} style={styles.heading}>
          <FontAwesome5 name="user-plus" size={22} color={COLORS.primary} /> Add Patient  
        </Animated.Text>

        {renderInput('Patient Name', 'name', form.name, 'Enter full name', true)}
        {renderInput('Age', 'age', form.age, 'Enter age', true, 'numeric')}
        {renderRadio('Gender', 'gender', form.gender)}
        {renderInput('Address', 'address', form.address, 'Enter full address', true)}
        {renderInput('Mobile Number', 'mobile', form.mobile, 'Enter 10-digit mobile', true, 'phone-pad', errors.mobile)}
        {renderInput('Email', 'email', form.email, 'Enter valid email', false, 'email-address', errors.email)}

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputBlock}>
          <Text style={styles.label}>Department <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity style={styles.inputIconWrapper} onPress={() => setShowDeptModal(true)}>
            <FontAwesome5 name="hospital" size={16} color={COLORS.icon} style={styles.icon} />
            <Text style={[styles.input, { color: form.department ? COLORS.text : COLORS.placeholder }]}>
              {form.department || 'Select Department'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {renderInput('Doctor Name', 'doctor', form.doctor, 'Enter doctor name')}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit & Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showDeptModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Department</Text>
            <FlatList
              data={departments}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleChange('department', item);
                    setShowDeptModal(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );

  function renderInput(label: string, key: string, value: string, placeholder: string, required = false, keyboardType: any = 'default', error?: string) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputBlock}>
        <Text style={styles.label}>{label} {required && <Text style={styles.required}>*</Text>}</Text>
        <View style={[styles.inputIconWrapper, error && { borderColor: COLORS.danger }]}>
          <FontAwesome5 name={key === 'mobile' ? 'phone' : key === 'email' ? 'envelope' : 'user'} size={16} color={COLORS.icon} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Animated.View>
    );
  }

  function renderRadio(label: string, key: string, value: string) {
    return (
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputBlock}>
        <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
        <View style={styles.radioGroup}>
          {['Male', 'Female', 'Other'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.radioButton, value === option && styles.radioSelected]}
              onPress={() => handleChange(key, option)}
            >
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginTop: 4,
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
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.border,
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
  },
  radioText: {
    color: COLORS.buttonText,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
