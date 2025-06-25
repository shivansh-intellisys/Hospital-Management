import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@/constants/Colors';

type Patient = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
};

export default function ViewPatients() {
  
    const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const stored = await AsyncStorage.getItem('patients');
        const list = stored ? JSON.parse(stored) : [];
        setPatients(list);
        setFiltered(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const lower = text.toLowerCase();
    const results = patients.filter(
      p =>
        p.name.toLowerCase().includes(lower) ||
        p.date.toLowerCase().includes(lower)
    );
    setFiltered(results);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient List</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or date"
        value={search}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        filtered.map(patient => (
          <View key={patient.id} style={styles.card}>
            <Text style={styles.id}>ID: {patient.id}</Text>
            <Text style={styles.name}>{patient.name}</Text>
            <Text>📱 {patient.mobile}</Text>
            <Text>🏠 {patient.address}</Text>
            <Text>📅 {patient.date} 🕒 {patient.time}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 15, color: COLORS.primary },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  id: { fontWeight: 'bold', color: COLORS.primary },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});
