// ✅ Updated TodayAppointments screen with integrated PatientDetailsModal (edit/view)

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, Platform, Alert, Dimensions
} from 'react-native';
import COLORS from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import PatientDetailsModal from '@/components/ui/PatientDetailsModal';

const { width } = Dimensions.get('window');

// Types

type Patient = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
  status?: 'pending' | 'completed';
  gender?: string;
  age?: string;
  bloodGroup?: string;
  email?: string;
  note?: string;
};

type SortOption = 'pendingFirst' | 'completedFirst';

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusSortOption, setStatusSortOption] = useState<SortOption>('pendingFirst');
const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchTodayAppointments = async () => {
    try {
      const list: Patient[] = (await getStorageItem('patients')) || [];
      const today = getTodayDate();
      const todayPatients = list.filter(p => p.date === today);
      setAppointments(todayPatients);
      applyFilters(todayPatients, search, statusSortOption);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTodayAppointments();
    }, [statusSortOption])
  );

  const applyFilters = (data: Patient[], searchText: string, sortOption: SortOption) => {
    const lower = searchText.toLowerCase();
    let results = data.filter(p =>
      p.name.toLowerCase().includes(lower) || p.time.toLowerCase().includes(lower)
    );

    results = sortByStatus(results, sortOption);
    setFiltered(results);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    applyFilters(appointments, text, statusSortOption);
  };

  const sortByStatus = (data: Patient[], option: SortOption) => {
    return [...data].sort((a, b) => {
      if (option === 'pendingFirst') {
        return (a.status === 'completed' ? 1 : 0) - (b.status === 'completed' ? 1 : 0);
      } else {
        return (a.status === 'pending' ? 1 : 0) - (b.status === 'pending' ? 1 : 0);
      }
    });
  };

  const markCompleted = async (id: number) => {
    try {
      const list: Patient[] = (await getStorageItem('patients')) || [];
      const updated = list.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'completed' ? 'pending' : 'completed' }
          : p
      );
      await setStorageItem('patients', updated);
      fetchTodayAppointments();
    } catch (e) {
      Alert.alert('Error', 'Failed to update appointment.');
    }
  };

  const handleToggleStatus = (id: number, currentStatus: 'pending' | 'completed' | undefined) => {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

  if (Platform.OS === 'web') {
    // Web: directly mark without alert
    markCompleted(id);
  } else {
    // Mobile: show confirmation
    Alert.alert(
      'Confirm',
      `Are you sure you want to mark as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => markCompleted(id) },
      ]
    );
  }
};


  const pendingCount = filtered.filter(p => p.status !== 'completed').length;

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
          <FontAwesome5 name="calendar-check" size={20} color={COLORS.primary} /> Today's Appointments {/* ({pendingCount} pending)*/}
        </Animated.Text>

        {/* Search and Sort Row */}
        <View style={styles.searchSortRow}>
          <View style={styles.searchContainer}>
            <FontAwesome5 name="search" size={16} color={COLORS.gray} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or time"
              value={search}
              onChangeText={handleSearch}
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.sortPickerWrapper}>
            <Picker
              selectedValue={statusSortOption}
              onValueChange={(value) => setStatusSortOption(value)}
              style={styles.picker}
            >
              <Picker.Item label="Pending First" value="pendingFirst" />
              <Picker.Item label="Completed First" value="completedFirst" />
            </Picker>
          </View>
        </View>

        {loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : filtered.length === 0 ? (
          <Text style={styles.noData}>No appointments for today.</Text>
        ) : (
          filtered.map((p) => (
            <Animated.View key={p.id} entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.patientName}>{p.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity onPress={() => { setSelectedPatientId(p.id); setModalVisible(true); }}>
                    <FontAwesome5 name="eye" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.patientId}>#{p.id}</Text>
                </View>
              </View>
              <Text style={styles.info}>📱 {p.mobile}</Text>
              <Text style={styles.info}>🏠 {p.address}</Text>
              <Text style={styles.info}>📅 {p.date} ⏰ {p.time}</Text>
              <Text style={styles.info}>📝 Status: {p.status || 'pending'}</Text>
              <TouchableOpacity
                style={[styles.button, p.status === 'completed' ? { backgroundColor: COLORS.success } : { backgroundColor: COLORS.danger }]}
                onPress={() => handleToggleStatus(p.id, p.status)}
              >
                <Text style={styles.buttonText}>
                  {p.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {modalVisible && selectedPatientId && (
        <PatientDetailsModal
          visible={modalVisible}
          patientId={selectedPatientId}
          onClose={() => setModalVisible(false)}
          onUpdated={() => {
            setModalVisible(false);
            fetchTodayAppointments();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.primary,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 10,
  },
  searchSortRow: {
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: COLORS.text,
  },
  sortPickerWrapper: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    width: width > 600 ? 200 : '100%',
  },
  picker: {
    color: COLORS.text,
    height: 50,
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
  patientName: { fontWeight: '700', color: COLORS.primary, fontSize: 16 },
  patientId: { fontSize: 13, color: COLORS.gray },
  info: { fontSize: 14, color: COLORS.text, marginBottom: 2 },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  noData: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 16,
    marginTop: 40,
  },
});
