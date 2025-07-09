// app/receptionist/dashboard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import PatientDetailsModal from '@/components/ui/PatientDetailsModal';

const { width } = Dimensions.get('window');

type Patient = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
  status?: 'pending' | 'completed';
};

export default function ReceptionistDashboard() {
  const router = useRouter();
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingList, setPendingList] = useState<Patient[]>([]);
  const [pendingModalVisible, setPendingModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const loadPendingPatients = async () => {
    const stored = await AsyncStorage.getItem('patients');
    const list: Patient[] = stored ? JSON.parse(stored) : [];
    const today = getTodayDate();
    const filtered = list.filter(p => p.date === today && p.status !== 'completed');
    setPendingList(filtered);
  };

  const handleStatusChange = async (id: number) => {
    const stored = await AsyncStorage.getItem('patients');
    let list: Patient[] = stored ? JSON.parse(stored) : [];

    list = list.map(p => (p.id === id ? { ...p, status: 'completed' } : p));
    await AsyncStorage.setItem('patients', JSON.stringify(list));

    // Update UI
    setPendingList(list.filter(p => p.date === getTodayDate() && p.status !== 'completed'));
    setPendingCount(prev => prev - 1);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchTodayPatients = async () => {
        const stored = await AsyncStorage.getItem('patients');
        const list: Patient[] = stored ? JSON.parse(stored) : [];

        const today = getTodayDate();
        const todayPatients = list.filter(p => p.date === today);
        const pending = todayPatients.filter(p => p.status !== 'completed');

        setTodayCount(todayPatients.length);
        setPendingCount(pending.length);
      };

      fetchTodayPatients();
    }, [])
  );

  const openPendingModal = async () => {
    await loadPendingPatients();
    setPendingModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Receptionist Dashboard</Text>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => router.replace('/receptionist/receptionProfile')}>
            <FontAwesome5 name="user-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{todayCount}</Text>
          <Text style={styles.statLabel}>Today's Patients</Text>
        </View>

        <TouchableOpacity style={styles.statBox} onPress={openPendingModal}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending Appointments</Text>
        </TouchableOpacity>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Pending Reports</Text>
        </View>
      </View>

      {/* Feature Grid */}
      <View style={styles.gridContainer}>
        {[
          { label: 'Add Patient', icon: 'user-plus', navigate: '/receptionist/add-patient' },
          { label: 'Book Appointment', icon: 'calendar-plus', navigate: '/receptionist/book-appointment' },
          { label: "Today's Appointments", icon: 'calendar-day', navigate: '/receptionist/today-appointments' },
          { label: 'Upload Prescription', icon: 'file-upload', navigate: '/receptionist/upload-report' },
          { label: 'View Patient/ List', icon: 'users', navigate: '/receptionist/view-patient' },
          { label: 'Upload Report', icon: 'file-medical-alt', navigate: '/receptionist/view-prescriptions' },
        ].map((feature, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => router.push(feature.navigate as any)}>
            <FontAwesome5 name={feature.icon} size={26} color={COLORS.icon} />
            <Text style={styles.cardText}>{feature.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal: Pending Appointment List */}
      <Modal visible={pendingModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pending Appointments</Text>
              <TouchableOpacity onPress={() => setPendingModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={pendingList}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.pendingItem}>
                  <View style={{ flex: 1 }}>
                   <View style={styles.iconRow}>
                      <Ionicons name="person-circle-outline" size={18} color={COLORS.primary} />
                      <Text style={styles.patientName}>{item.name}</Text>
                    </View>
                    <View style={styles.iconRow}>
                      <Ionicons name="call-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.patientInfo}>{item.mobile}</Text>
                    </View>
                    <View>
                      <Text style={[styles.patientInfo, { fontSize: 12 }]}>
                        {item.date} at {item.time}
                      </Text>
                    </View>

                  </View>
                  <TouchableOpacity onPress={() => handleStatusChange(item.id)} style={styles.statusButton}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Mark Done</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPatientId(item.id);
                      setDetailsModalVisible(true);
                    }}
                    style={styles.eyeButton}
                  >
                    <FontAwesome5 name="eye" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal: Patient Details */}
      <PatientDetailsModal
        visible={detailsModalVisible}
        patientId={selectedPatientId}
        onClose={() => setDetailsModalVisible(false)}
        onUpdated={() => {
          loadPendingPatients();
          setDetailsModalVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light, padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logout: { color: COLORS.danger, fontWeight: 'bold', marginLeft: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 20,
  },
  statBox: {
    width: width > 600 ? '30%' : '30%',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 14, color: COLORS.text, marginTop: 4, textAlign: 'center' },
  gridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
  },
  card: {
    width: '48%', backgroundColor: COLORS.card, padding: 20, borderRadius: 12,
    alignItems: 'center', marginBottom: 20, elevation: 3,
  },
  cardText: {
    fontSize: 14, fontWeight: '600', color: COLORS.text, textAlign: 'center', marginTop: 10,
  },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000080', justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', color: COLORS.primary,
  },
  pendingItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.border,
  },
  patientName: { fontWeight: '600', fontSize: 15, color: COLORS.text },
  patientInfo: { fontSize: 13, color: COLORS.gray },
  statusButton: {
    backgroundColor: COLORS.success, paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 6, marginHorizontal: 5,
  },
  eyeButton: {
    padding: 8, borderRadius: 6, backgroundColor: COLORS.card,
  },
  iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 2,
  flexWrap: 'wrap',
},

});
