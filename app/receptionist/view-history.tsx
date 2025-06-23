import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import COLORS from '@/constants/Colors';

type HistoryRecord = {
  id: number;
  name:string;
  date: string;
  diagnosis: string;
  prescription: string;
  doctor: string;
};

export default function ViewHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const patientId = '12345'; // 👈 Replace with real ID from login or selection

  useEffect(() => {
    // Simulating an API call
    const fetchHistory = async () => {
      try {
        // Here you'd call your real API like:
        // const response = await fetch(`https://your-api.com/patients/${patientId}/history`);
        // const data = await response.json();

        const data: HistoryRecord[] = [
          {
            id: 1,
            name:"Shiv",
            date: '2024-06-01',
            diagnosis: 'Fever & Cough',
            prescription: 'Paracetamol 500mg',
            doctor: 'Dr. Renu Verma',
          },
          {
            id: 2,
            name:'Karan',
            date: '2024-05-12',
            diagnosis: 'Headache',
            prescription: 'Ibuprofen 400mg',
            doctor: 'Dr. Mohan Gupta',
          },
           {
            id: 1,
            name:"Shiv",
            date: '2024-06-01',
            diagnosis: 'Fever & Cough',
            prescription: 'Paracetamol 500mg',
            doctor: 'Dr. Renu Verma',
          },
          {
            id: 2,
            name:'Karan',
            date: '2024-05-12',
            diagnosis: 'Headache',
            prescription: 'Ibuprofen 400mg',
            doctor: 'Dr. Mohan Gupta',
          },
        ];

        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient History</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : history.length === 0 ? (
        <Text style={styles.noData}>No history available.</Text>
      ) : (
        history.map((record) => (
          <View key={record.id} style={styles.card}>
            <Text style={styles.date}>📅 {record.date}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Patient-Name:</Text> {record.name}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Doctor:</Text> {record.doctor}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Diagnosis:</Text> {record.diagnosis}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Prescription:</Text> {record.prescription}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.primary,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.text,
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.gray,
  },
});
