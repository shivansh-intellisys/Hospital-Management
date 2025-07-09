import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import COLORS from '@/constants/Colors';

interface TestReport {
  id: string;
  title: string;
  date: string;
  fileUrl: string;
}

export default function TestReports() {
  const { id } = useLocalSearchParams();
  const [reports, setReports] = useState<TestReport[]>([]);

  useEffect(() => {
    // Sample test reports — replace with real AsyncStorage fetch
    const mockReports: TestReport[] = [
      {
        id: '1',
        title: 'Blood Test Report',
        date: '2024-07-01',
        fileUrl: 'https://example.com/reports/blood-test.pdf',
      },
      {
        id: '2',
        title: 'X-Ray Chest',
        date: '2024-07-01',
        fileUrl: 'https://example.com/reports/xray.jpg',
      },
    ];

    setReports(mockReports); // You can filter by visit ID if needed
  }, []);

  const openFile = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else alert("Can't open file");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧪 Test Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.noData}>No reports found.</Text>
      ) : (
        reports.map((report) => (
          <View key={report.id} style={styles.card}>
            <Text style={styles.title}>{report.title}</Text>
            <Text style={styles.date}>📅 {report.date}</Text>
            <TouchableOpacity onPress={() => openFile(report.fileUrl)}>
              <Text style={styles.link}>🔗 View Report</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: COLORS.text },
  date: { fontSize: 14, color: COLORS.gray, marginBottom: 8 },
  link: { color: COLORS.tint || '#007AFF', fontSize: 14, fontWeight: '600' },
  noData: { fontStyle: 'italic', color: COLORS.gray, textAlign: 'center', marginTop: 20 },
});
