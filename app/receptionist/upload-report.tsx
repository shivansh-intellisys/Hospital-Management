// app/receptionist/upload-report.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import COLORS from '@/constants/Colors';

export default function UploadReport() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedPatient || !reportTitle || !file) {
      Alert.alert('Please fill all fields and select a file');
      return;
    }

    // Upload logic here... Back-end part --------------------
    Alert.alert('Success', 'Report uploaded successfully');
    // Reset
    setSelectedPatient('');
    setReportTitle('');
    setNotes('');
    setFile(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Patient Report</Text>

      <Text style={styles.label}>Select Patient</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedPatient}
          onValueChange={(itemValue) => setSelectedPatient(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Patient --" value="" />
          <Picker.Item label="Ravi Kumar" value="ravi" />
          <Picker.Item label="Sneha Gupta" value="sneha" />
          <Picker.Item label="Amit Singh" value="amit" />
        </Picker>
      </View>

      <Text style={styles.label}>Report Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., X-ray Report"
        value={reportTitle}
        onChangeText={setReportTitle}
      />

      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Add any notes about this report"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handleFilePick}>
        <Text style={styles.uploadBtnText}>{file ? file.name : 'Select File (PDF/Image)'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
        <Text style={styles.submitBtnText}>Upload Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    backgroundColor: COLORS.background,
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 4,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    marginBottom: 16,
  },
  picker: {
    height: 48,
    paddingHorizontal: 10,
    color: COLORS.text,
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
  },
  uploadBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBtnText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  submitBtnText: {
    color: COLORS.buttonText,
    fontWeight: '700',
    fontSize: 16,
  },
});
