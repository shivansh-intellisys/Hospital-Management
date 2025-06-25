import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { useRouter, useFocusEffect } from 'expo-router';

// ✅ Define the Patient type
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
  const router = useRouter();

  const fetchPatients = async () => {
    try {
      const stored = await AsyncStorage.getItem('patients');
      const list: Patient[] = stored ? JSON.parse(stored) : [];
      setPatients(list);
      setFiltered(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPatients();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    const lower = text.toLowerCase();
    const results = patients.filter(
      (p: Patient) =>
        p.name.toLowerCase().includes(lower) ||
        p.date.toLowerCase().includes(lower)
    );
    setFiltered(results);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>📋 All Patients</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search by name or date"
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={handleSearch}
        />

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : filtered.length === 0 ? (
          <Text style={styles.noData}>No patients found.</Text>
        ) : (
          filtered.map((patient: Patient) => (
            <View key={patient.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientId}>#{patient.id}</Text>
              </View>
              <Text style={styles.info}>📱 {patient.mobile}</Text>
              <Text style={styles.info}>🏠 {patient.address}</Text>
              <Text style={styles.info}>📅 {patient.date} ⏰ {patient.time}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/receptionist/add-patient')}
      >
        <Ionicons name="add" size={28} color={COLORS.buttonText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.primary,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  patientName: {
    fontWeight: '700',
    color: COLORS.primary,
    fontSize: 16,
  },
  patientId: {
    fontSize: 13,
    color: COLORS.gray,
  },
  info: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  noData: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 16,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
});
