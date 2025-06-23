import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '@/constants/Colors';

type Prescription = {
  id: number;
  date: string;
  doctor: string;
  notes: string;
  medicines: string[];
};

export default function ViewPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const patientId = '12345'; // Replace with dynamic value later

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Simulate API call
        const data: Prescription[] = [
          {
            id: 1,
            date: '2024-06-01',
            doctor: 'Dr. Renu Verma',
            notes: 'Mild fever, prescribed rest and medication.',
            medicines: ['Paracetamol 500mg', 'Vitamin C 1000mg'],
          },
          {
            id: 2,
            date: '2024-05-10',
            doctor: 'Dr. Mohan Gupta',
            notes: 'Migraine symptoms, avoid screen time.',
            medicines: ['Ibuprofen 400mg', 'Caffeine 100mg'],
          },
        ];

        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient Prescriptions</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : prescriptions.length === 0 ? (
        <Text style={styles.noData}>No prescriptions found.</Text>
      ) : (
        prescriptions.map((prescription) => (
          <View key={prescription.id} style={styles.card}>
            <Text style={styles.date}>📅 {prescription.date}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Doctor:</Text> {prescription.doctor}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Notes:</Text> {prescription.notes}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Medicines:</Text></Text>
            {prescription.medicines.map((med, index) => (
              <Text key={index} style={styles.medicine}>• {med}</Text>
            ))}
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
  medicine: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.gray,
  },
});
