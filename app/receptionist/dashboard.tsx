import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#1E90FF',
  background: '#F8F9FB',
  card: '#ffffff',
  text: '#333333',
  buttonText: '#ffffff',
  border: '#ddd',
  danger: '#FF4C4C',
};

export default function ReceptionistDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header with Profile & Logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Receptionist Dashboard</Text>
        <View style={styles.profileSection}>         
          <TouchableOpacity onPress={() => router.replace('/receptionist/receptionistProfile')}>
            <Image  
            source={require('../../assets/images/receptionist.jpg')}
            style={styles.avatar}
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/auth/login')}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>58</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Today's Appointments</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Pending Reports</Text>
        </View>
      </View>

      {/* Feature Grid */}
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/add-patient')}>
          <Image source={require('../../assets/images/add_patient1.jpeg')} style={styles.icon} />
          <Text style={styles.cardText}>Add Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/book-appointment')}>
          <Image source={require('../../assets/images/book_appointment.png')} style={styles.icon} />
          <Text style={styles.cardText}>Book Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/view-appointments')}>
          <Image source={require('../../assets/images/view_appointments.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>View Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/upload-report')}>
          <Image source={require('../../assets/images/upload_report.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>Upload Prescription</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/view-patient')}>
          <Image source={require('../../assets/images/upload_report.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>View Patient/ List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/receptionist/view-prescriptions')}>
          <Image source={require('../../assets/images/upload_report.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>Upload Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  logout: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statBox: {
    width: width > 600 ? '30%' : '30%',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '48%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center'
  }
});
