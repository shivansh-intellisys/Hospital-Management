import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@/constants/Colors';

interface Prescription {
  id: string;
  title: string;
  date: string;
  fileUrl: string;
  visitId: string;
}

export default function MyPrescriptions() {
  const { id } = useLocalSearchParams(); // visitId from query
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const stored = await AsyncStorage.getItem('prescriptions');
        const allPrescriptions: Prescription[] = stored ? JSON.parse(stored) : [];

        const filtered = allPrescriptions.filter(p => p.visitId === id);
        setPrescriptions(filtered);
      } catch (err) {
        console.log("Error fetching prescriptions:", err);
      }
    };

    loadPrescriptions();
  }, [id]);

  const openFile = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else alert("Can't open file");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>💊 Prescriptions</Text>

      {prescriptions.length === 0 ? (
        <Text style={styles.noData}>No prescriptions found for this visit.</Text>
      ) : (
        prescriptions.map((presc) => (
          <View key={presc.id} style={styles.card}>
            <Text style={styles.title}>{presc.title}</Text>
            <Text style={styles.date}>📅 {presc.date}</Text>
            <TouchableOpacity onPress={() => openFile(presc.fileUrl)}>
              <Text style={styles.link}>🔗 View Prescription</Text>
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
