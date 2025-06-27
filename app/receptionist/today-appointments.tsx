import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '@/constants/Colors';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Types

type Patient = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
};

type SortOption = 'date' | 'newest' | 'oldest';

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [showFromPicker, setShowFromPicker] = useState<boolean>(false);
  const [showToPicker, setShowToPicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const router = useRouter();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchTodayAppointments = async () => {
    try {
      const stored = await AsyncStorage.getItem('patients');
      const list: Patient[] = stored ? JSON.parse(stored) : [];
      const today = getTodayDate();
      const todayPatients = list.filter((p: Patient) => p.date === today);
      const sorted = sortAppointments(todayPatients, sortOption);
      setAppointments(todayPatients);
      setFiltered(sorted);
      setFromDate(null);
      setToDate(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, [sortOption]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTodayAppointments();
    }, [sortOption])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    const lower = text.toLowerCase();
    const results = appointments.filter((p: Patient) =>
      p.name.toLowerCase().includes(lower) || p.time.toLowerCase().includes(lower)
    );
    const sorted = sortAppointments(results, sortOption);
    setFiltered(sorted);
  };

  const sortAppointments = (data: Patient[], option: SortOption): Patient[] => {
    switch (option) {
      case 'newest':
        return [...data].sort((a, b) => b.id - a.id);
      case 'oldest':
        return [...data].sort((a, b) => a.id - b.id);
      case 'date':
      default:
        return [...data].sort((a, b) => {
          const dtA = new Date(`${a.date}T${a.time}`);
          const dtB = new Date(`${b.date}T${b.time}`);
          return dtA.getTime() - dtB.getTime();
        });
    }
  };

  const applyDateFilter = () => {
    if (!fromDate && !toDate) {
      setFiltered(sortAppointments(appointments, sortOption));
      return;
    }
    const filteredByRange = appointments.filter((p: Patient) => {
      const d = new Date(p.date);
      return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
    });
    setFiltered(sortAppointments(filteredByRange, sortOption));
  };

  const clearDateFilter = () => {
    setFromDate(null);
    setToDate(null);
    setFiltered(sortAppointments(appointments, sortOption));
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
          <FontAwesome5 name="calendar-check" size={20} color={COLORS.primary} /> Today's Appointments
        </Animated.Text>

        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color={COLORS.gray} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or time"
            placeholderTextColor={COLORS.gray}
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.datePickers}>
            <Pressable onPress={() => setShowFromPicker(true)} style={styles.dateBtn}>
              <Text style={styles.dateText}>{fromDate ? fromDate.toDateString() : 'From Date'}</Text>
            </Pressable>
            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowFromPicker(false);
                  if (selectedDate) {
                    setFromDate(selectedDate);
                    applyDateFilter();
                  }
                }}
              />
            )}

            <Pressable onPress={() => setShowToPicker(true)} style={styles.dateBtn}>
              <Text style={styles.dateText}>{toDate ? toDate.toDateString() : 'To Date'}</Text>
            </Pressable>
            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowToPicker(false);
                  if (selectedDate) {
                    setToDate(selectedDate);
                    applyDateFilter();
                  }
                }}
              />
            )}

            {(fromDate || toDate) && (
              <Pressable onPress={clearDateFilter} style={styles.clearBtn}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.sortDropdown}>
            <Picker
  selectedValue={sortOption}
  onValueChange={(value: SortOption) => setSortOption(value)}
  style={styles.picker}
  dropdownIconColor={COLORS.text} // 👈 Important for visibility of dropdown icon
  itemStyle={{ color: COLORS.text }} // 👈 Forces picker items to use this color
>
  <Picker.Item label="Sort by Date" value="date" />
  <Picker.Item label="Newly Added" value="newest" />
  <Picker.Item label="Oldest Added" value="oldest" />
</Picker>

          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : filtered.length === 0 ? (
          <Text style={styles.noData}>No appointments for today.</Text>
        ) : (
          filtered.map((patient: Patient) => (
            <Animated.View key={patient.id} entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientId}>#{patient.id}</Text>
              </View>
              <Text style={styles.info}>📱 {patient.mobile}</Text>
              <Text style={styles.info}>🏠 {patient.address}</Text>
              <Text style={styles.info}>📅 {patient.date} ⏰ {patient.time}</Text>
            </Animated.View>
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
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  datePickers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  dateBtn: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  dateText: {
    color: COLORS.text,
  },
  clearBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: '600',
  },
  sortDropdown: {
    minWidth: 160,
  },
  sortLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    fontWeight: '600',
  },
 picker: {
  backgroundColor: COLORS.card,
  borderRadius: 10,
  height: 40,
  width: 160, // or '100%' for responsiveness
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
