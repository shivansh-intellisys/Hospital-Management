import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from 'expo-router';



const { width } = Dimensions.get('window');
type RootStackParamList = {
  login: undefined;
};

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'login'>;
};


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation })  => {

  const doctors = [
    {
      id: 1,
      name: 'Dr. Renu Verma',
      specialization: 'Cardiologist',
      image: require('@/assets/images/doctor1.png'),
      experience: '15 years'
    },
    {
      id: 2,
      name: 'Dr. Amit Sharma',
      specialization: 'Neurologist',
      image: require('@/assets/images/doctor1.png'),
      experience: '10 years'
    }
  ];

  const schedule = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Emergency Only' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Menu Bar */}
      {/* <View style={styles.menuBar}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contact</Text>
        </TouchableOpacity>
      </View> */}

      {/* Clinic Header */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/clinic_logo.jpg')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Your Health, Our Priority</Text>
      </View>

      {/* Login Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.patientCard]}
         onPress={() => router.push({ pathname: '/auth/login', params: { role: 'patient' } })}

        >
          <Ionicons name="person" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Patient</Text>
          <Text style={styles.cardText}>Login to access your health records</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.receptionCard]}
          onPress={() => router.push({ pathname: '/auth/login', params: { role: 'receptionist' } })}

        >
          <Ionicons name="desktop" size={32} color="#fff" />
          <Text style={styles.cardTitle}>Reception</Text>
          <Text style={styles.cardText}>Staff login for administration</Text>
        </TouchableOpacity>
      </View>

      {/* Doctors Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Doctors</Text>
        {doctors.map(doctor => (
          <View key={doctor.id} style={styles.doctorCard}>
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
              <Text style={styles.doctorExperience}>{doctor.experience} experience</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Schedule Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clinic Hours</Text>
        <View style={styles.scheduleCard}>
          {schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>{item.day}</Text>
              <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="alert-circle" size={20} color="#fff" />
            <Text style={styles.emergencyText}>Emergency Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '500',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  card: {
    width: width * 0.43,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  patientCard: {
    backgroundColor: '#4CAF50',
  },
  receptionCard: {
    backgroundColor: '#007AFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  cardText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 10,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#666',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleDay: {
    fontSize: 14,
    color: '#333',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  emergencyText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WelcomeScreen;