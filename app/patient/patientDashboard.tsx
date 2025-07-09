import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { Patient } from '@/types/Patient';

interface VisitHistory {
  id: string;
  date: string;
  doctor: string;
  notes: string;
}

interface PatientData {
  id: number;
  name: string;
  mobile: string;
  address: string;
  visitHistory?: VisitHistory[];
}

export default function PatientDashboard() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // get patient id from URL
  const [patient, setPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const stored = await AsyncStorage.getItem('patients');
      const list: PatientData[] = stored ? JSON.parse(stored) : [];
      const found = list.find((p) => p.id === Number(id));
      if (found) setPatient(found);
    };
    fetchPatient();
  }, [id]);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Do you want to logout?');
      if (confirm) {
        router.replace('/auth/login');
      }
    } else {
      Alert.alert('Logout', 'Do you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Text style={styles.header}>Patient Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../../assets/images/patient.jpg')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{patient?.name}</Text>
            <Text style={styles.profileInfo}>📞 {patient?.mobile}</Text>
            <Text style={styles.profileInfo}>📍 {patient?.address}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Patient Dashboard Menu */}
      <Text style={styles.sectionTitle}>Patient Dashboard</Text>
      <View style={styles.menuGrid}>
        {[
          {
            icon: 'calendar-alt',
            label: 'Visited History',
            onPress: () => router.push(`/patient/visit-history?id=${id}`),
          },
          {
            icon: 'file-prescription',
            label: 'Prescriptions',
            onPress: () => router.push(`/patient/my-prescriptions?id=${id}`),
          },
          {
            icon: 'vials',
            label: 'Test Reports',
            onPress: () => router.push(`/patient/test-reports?id=${id}`),
          },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={item.onPress}>
            <FontAwesome5 name={item.icon as any} size={24} color={COLORS.icon} />
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: COLORS.primary,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightBlue,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 14,
    color: COLORS.text,
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: COLORS.danger,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.secondary,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: width > 600 ? '30%' : '48%',
    backgroundColor: COLORS.card,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 16,
  },
  cardText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
});
