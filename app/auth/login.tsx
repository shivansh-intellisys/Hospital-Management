import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const roles = [
  { label: 'Receptionist', value: 'receptionist', icon: require('@/assets/images/receptionist.jpg') },
  { label: 'Doctor', value: 'doctor', icon: require('@/assets/images/doctor.png') },
  { label: 'Patient', value: 'patient', icon: require('@/assets/images/patient.jpg') },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('receptionist');

  const handleLogin = () => {
    // ✅ Normally you'd validate from backend here
    if (!email || !password) {
      alert('Please enter credentials');
      return;
    }

    // Save user info to localStorage / secure store if needed
    // Redirect based on role
    if (selectedRole === 'receptionist') {
      router.replace('/receptionist/dashboard');
    } else if (selectedRole === 'patient') {
      router.replace('/patient/patientDashboard');
    } else {
      alert('Doctor flow not implemented yet'); //   if doctor also want login page then we can add 
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>MediFlow</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10 }}>Don't have an account? Sign up</Text>

      <View style={styles.roles}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.value}
            onPress={() => setSelectedRole(role.value)}
            style={[
              styles.roleBtn,
              selectedRole === role.value && styles.roleSelected,
            ]}
          >
            <Image source={role.icon} style={styles.icon} />
            <Text>{role.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 },
  logo: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  loginText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  roles: { flexDirection: 'row', marginTop: 20, gap: 10 },
  roleBtn: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
  },
  roleSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  icon: { width: 40, height: 40, resizeMode: 'contain', marginBottom: 5 },
});
