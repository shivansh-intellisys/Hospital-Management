import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import COLORS from '@/constants/Colors';

export default function VisitDetails() {
  const visit = {
    doctor: 'Dr. Shivansh Pandey',
    date: 'April 20, 2025',
    symptoms: 'Fever, Headache, Fatigue',
    medicines: ['Paracetamol 500mg', 'Vitamin C 1000mg'],
    tests: ['CBC', 'COVID-19 Test'],
    notes: 'Patient should rest well and stay hydrated. Come for review after 3 days.',
    reports: [
      { type: 'pdf', name: 'Blood_Report.pdf' },
      { type: 'image', uri: 'https://via.placeholder.com/150' },
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Visit Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Doctor:</Text>
        <Text style={styles.value}>{visit.doctor}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{visit.date}</Text>

        <Text style={styles.label}>Symptoms:</Text>
        <Text style={styles.value}>{visit.symptoms}</Text>

        <Text style={styles.label}>Prescribed Medicines:</Text>
        {visit.medicines.map((med, idx) => (
          <Text key={idx} style={styles.value}>• {med}</Text>
        ))}

        <Text style={styles.label}>Suggested Tests:</Text>
        {visit.tests.map((test, idx) => (
          <Text key={idx} style={styles.value}>• {test}</Text>
        ))}

        <Text style={styles.label}>Doctor's Notes:</Text>
        <Text style={styles.value}>{visit.notes}</Text>

        <Text style={styles.label}>Reports:</Text>
        {visit.reports.map((report, idx) =>
          report.type === 'image' ? (
            <Image
              key={idx}
              source={{ uri: report.uri }}
              style={styles.reportImage}
            />
          ) : (
            <TouchableOpacity key={idx} style={styles.pdfLink}>
              <Text style={styles.pdfText}>📄 {report.name}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 12,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
  },
  reportImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  pdfLink: {
    marginTop: 8,
    padding: 10,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 6,
  },
  pdfText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
