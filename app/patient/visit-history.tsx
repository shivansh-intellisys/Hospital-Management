import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';

interface VisitedEntry {
  date: string;
  time: string;
  department: string;
  doctor: string;
  status: string;
}

interface Patient {
  id: number;
  name: string;
  visitHistory: VisitedEntry[];
}

export default function VisitedHistory() {
  const [history, setHistory] = useState<VisitedEntry[]>([]);
  const [patientName, setPatientName] = useState<string>('');
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const loadPatientHistory = async () => {
      const stored = await AsyncStorage.getItem('patients');
      const data: Patient[] = stored ? JSON.parse(stored) : [];
      const selectedPatient = data.find((p) => p.id === Number(id));
      if (selectedPatient) {
        setPatientName(selectedPatient.name);
        setHistory(selectedPatient.visitHistory || []);
      }
    };
    loadPatientHistory();
  }, [id]);

  const renderHistoryItem = ({ item }: { item: VisitedEntry }) => (
    <View style={styles.historyCard}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <FontAwesome5 name="calendar-day" size={16} color={COLORS.primary} />
          <Text style={styles.dateText}>  {item.date}</Text>
        </View>
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'completed' ? '#d4edda' :
                item.status === 'cancelled' ? '#f8d7da' :
                '#fff3cd',
              color: '#000',
            },
          ]}
        >
          {item.status?.toUpperCase()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="access-time" size={16} color={COLORS.text} />
        <Text style={styles.historyDetail}>  {item.time}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="hospital-building" size={16} color={COLORS.text} />
        <Text style={styles.historyDetail}>  {item.department}</Text>
      </View>

      <View style={styles.detailRow}>
        <FontAwesome5 name="user-md" size={16} color={COLORS.text} />
        <Text style={styles.historyDetail}>  {item.doctor}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        <FontAwesome5 name="user-injured" size={20} color={COLORS.primary} /> Patient: {patientName}
      </Text>

      <Text style={styles.sectionTitle}>
        <FontAwesome5 name="notes-medical" size={16} color={COLORS.text} />  Visit History
      </Text>

      {history.length === 0 ? (
        <Text style={styles.noData}>No visit history found.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderHistoryItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 4,
  },
  historyCard: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderColor: COLORS.border,
    borderWidth: 1,
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  historyDetail: {
    fontSize: 14,
    color: COLORS.text,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: COLORS.placeholder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
