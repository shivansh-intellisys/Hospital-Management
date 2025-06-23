import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/Colors';

export default function PatientDashboard() {
  const router = useRouter();

  // Sample patient data (replace with real logged-in user data)
  const patient = {
    name: 'Rahul Verma',
    mobile: '+91 9876543210',
    address: 'Lucknow, Uttar Pradesh',
  };

  // Sample history data
  const history = [
    {
      id: '1',
      date: 'May 10, 2025',
      doctor: 'Dr. A.K. Singh',
      notes: 'Prescribed vitamins and blood test',
    },
    {
      id: '2',
      date: 'Apr 02, 2025',
      doctor: 'Dr. Meena Sharma',
      notes: 'Routine check-up',
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: () => router.replace('/auth/login') },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome, {patient.name}</Text>

      {/* Profile Card Section */}
<View style={styles.profileCard}>
  <View style={styles.profileHeader}>
    <Image
      source={require('../../assets/images/patient.jpg')}
      style={styles.profileImage}
    />
    <View style={styles.profileDetails}>
      <Text style={styles.profileName}>{patient.name}</Text>
      <Text style={styles.profileInfo}>📞 {patient.mobile}</Text>
      <Text style={styles.profileInfo}>📍 {patient.address}</Text>
    </View>
  </View>

  <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
</View>


      {/* Visit History */}
      <Text style={styles.sectionTitle}>🗓️ Visit History</Text>
      {history.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.historyCard}
          onPress={() => router.push("/patient/my-appointments")} // link to details
          // onPress={() => router.push(`/patient/history/${item.id}`)} // link to details
        >
          <Text style={styles.historyDate}>{item.date}</Text>
          <Text style={styles.historyInfo}>Doctor: {item.doctor}</Text>
          <Text style={styles.historyInfo}>Note: {item.notes}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

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
},

profileImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 16,
  backgroundColor: COLORS.lightBlue,
},

profileDetails: {
  flex: 1,
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
  color: COLORS.buttonText || '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.secondary,
  },
  historyCard: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyDate: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  historyInfo: {
    fontSize: 14,
    color: COLORS.text,
  },
});
