// app/patient/add-visit-entry.tsx

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Platform, Button, Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@/constants/Colors';

interface VisitEntry {
  id: string;
  date: string;
  doctor: string;
  symptoms: string;
  tests: string;
  advice: string;
  prescriptionFile?: string;
  reportFile?: string;
}

export default function AddVisitEntry() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [tests, setTests] = useState('');
  const [advice, setAdvice] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<string | undefined>(undefined);
  const [reportFile, setReportFile] = useState<string | undefined>(undefined);

  const today = new Date().toISOString().split('T')[0];

  const handleFileUpload = async (setFile: (uri: string) => void) => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setFile(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!doctor || !symptoms || !tests || !advice) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    const visit: VisitEntry = {
      id: `${Date.now()}`,
      date: today,
      doctor,
      symptoms,
      tests,
      advice,
      prescriptionFile,
      reportFile,
    };

    try {
      const stored = await AsyncStorage.getItem('patients');
      const list = stored ? JSON.parse(stored) : [];

      const updatedList = list.map((p: any) => {
        if (p.id.toString() === id) {
          const updatedHistory = p.visitHistory ? [...p.visitHistory, visit] : [visit];
          return { ...p, visitHistory: updatedHistory };
        }
        return p;
      });

      await AsyncStorage.setItem('patients', JSON.stringify(updatedList));
      Alert.alert('Success', 'Visit entry added successfully.');
      router.back();
    } catch (error) {
      console.error('Error saving visit:', error);
      Alert.alert('Error', 'Failed to save visit.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Visit Entry</Text>

      <Text style={styles.label}>Doctor Name *</Text>
      <TextInput style={styles.input} value={doctor} onChangeText={setDoctor} placeholder="e.g. Dr. Sharma" />

      <Text style={styles.label}>Symptoms / Problem *</Text>
      <TextInput style={styles.input} value={symptoms} onChangeText={setSymptoms} placeholder="e.g. Fever, Headache" multiline />

      <Text style={styles.label}>Tests Advised *</Text>
      <TextInput style={styles.input} value={tests} onChangeText={setTests} placeholder="e.g. CBC, X-Ray" multiline />

      <Text style={styles.label}>Doctor's Advice *</Text>
      <TextInput style={styles.input} value={advice} onChangeText={setAdvice} placeholder="e.g. Rest, Hydration" multiline />

      <Text style={styles.label}>Upload Prescription</Text>
      <Button title="Upload Prescription File" onPress={() => handleFileUpload(setPrescriptionFile)} />
      {prescriptionFile && <Text style={styles.filePath}>{prescriptionFile}</Text>}

      <Text style={styles.label}>Upload Test Report</Text>
      <Button title="Upload Report File" onPress={() => handleFileUpload(setReportFile)} />
      {reportFile && <Text style={styles.filePath}>{reportFile}</Text>}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save Visit Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: COLORS.primary, textAlign: 'center' },
  label: { fontSize: 15, fontWeight: '600', marginTop: 12, marginBottom: 4, color: COLORS.text },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10,
    backgroundColor: COLORS.card, color: COLORS.text, minHeight: 40
  },
  filePath: { fontSize: 12, color: COLORS.gray, marginTop: 6 },
  submitBtn: {
    backgroundColor: COLORS.success, marginTop: 24, paddingVertical: 14,
    borderRadius: 10, alignItems: 'center'
  },
  submitText: { color: COLORS.buttonText, fontWeight: 'bold', fontSize: 16 }
});
