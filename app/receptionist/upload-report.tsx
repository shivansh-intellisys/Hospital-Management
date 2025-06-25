import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@/constants/Colors';

export default function UploadPrescription() {
  const [mode, setMode] = useState<'file' | 'manual' | null>(null);
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    gender: '',
    symptoms: '',
    diagnosis: '',
    medicines: '',
    advice: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) {
      setFile(result.assets[0]);
      Alert.alert('Success', 'File selected successfully');
    }
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    if (mode === 'file') {
      if (!file) return Alert.alert('Error', 'Please select a file first');
      const fileData = {
        name: file.name,
        type: file.mimeType,
        uri: file.uri,
        uploadedAt: timestamp,
      };
      await AsyncStorage.setItem('lastUploadedFile', JSON.stringify(fileData));
      Alert.alert('Success', 'File uploaded successfully!');
      setFile(null);
    } else {
      if (!form.patientName || !form.diagnosis || !form.medicines) {
        return Alert.alert('Error', 'Please fill all required fields');
      }
      const formData = { ...form, submittedAt: timestamp };
      await AsyncStorage.setItem('lastManualPrescription', JSON.stringify(formData));
      Alert.alert('Success', 'Prescription submitted manually');
      setForm({
        patientName: '',
        age: '',
        gender: '',
        symptoms: '',
        diagnosis: '',
        medicines: '',
        advice: '',
        doctor: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const getFileIcon = (type: string | undefined) => {
    if (!type) return '📎';
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Upload Prescription</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'file' && styles.activeToggle]}
          onPress={() => setMode('file')}
        >
          <Text style={styles.toggleText}>Upload File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'manual' && styles.activeToggle]}
          onPress={() => setMode('manual')}
        >
          <Text style={styles.toggleText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>

      {mode === 'file' && (
        <View style={styles.card}>
          <Text style={styles.label}>Upload File (PDF, JPG, PNG)</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile}>
            <Text style={styles.uploadText}>
              {file ? `${getFileIcon(file.mimeType)} ${file.name}` : 'Choose File'}
            </Text>
          </TouchableOpacity>
          {file?.mimeType?.startsWith('image/') && (
            <Image source={{ uri: file.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />
          )}
        </View>
      )}

      {mode === 'manual' && (
        <View style={styles.card}>
          <Text style={styles.label}>Patient Name *</Text>
          <TextInput
            style={styles.input}
            value={form.patientName}
            onChangeText={(text) => handleChange('patientName', text)}
            placeholder="Full Name"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={form.age}
            keyboardType="numeric"
            onChangeText={(text) => handleChange('age', text)}
            placeholder="Age"
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={form.gender}
            onChangeText={(text) => handleChange('gender', text)}
            placeholder="Male / Female / Other"
          />

          <Text style={styles.label}>Symptoms</Text>
          <TextInput
            style={styles.input}
            value={form.symptoms}
            onChangeText={(text) => handleChange('symptoms', text)}
            placeholder="e.g. Fever, Headache"
          />

          <Text style={styles.label}>Diagnosis *</Text>
          <TextInput
            style={styles.input}
            value={form.diagnosis}
            onChangeText={(text) => handleChange('diagnosis', text)}
            placeholder="Diagnosis details"
          />

          <Text style={styles.label}>Medicines *</Text>
          <TextInput
            style={styles.input}
            value={form.medicines}
            onChangeText={(text) => handleChange('medicines', text)}
            placeholder="Prescribed medicines"
          />

          <Text style={styles.label}>Advice</Text>
          <TextInput
            style={styles.input}
            value={form.advice}
            onChangeText={(text) => handleChange('advice', text)}
            placeholder="Any additional advice"
          />

          <Text style={styles.label}>Doctor Name</Text>
          <TextInput
            style={styles.input}
            value={form.doctor}
            onChangeText={(text) => handleChange('doctor', text)}
            placeholder="Dr. Name"
          />

          <Text style={styles.label}>Date</Text>
          <TextInput style={styles.input} value={form.date} editable={false} />
        </View>
      )}

      {mode && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  toggleButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: 14,
  },
  uploadButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  uploadText: {
    color: COLORS.buttonText,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: 16,
  },
});
