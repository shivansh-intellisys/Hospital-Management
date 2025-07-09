// PatientDetailsModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Platform
} from 'react-native';
import COLORS from '@/constants/Colors';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

type Patient = {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  date: string;
  time: string;
  status?: 'pending' | 'completed';
  [key: string]: any;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  patientId: number | null;
  onUpdated: () => void;
};

export default function PatientDetailsModal({
  visible,
  onClose,
  patientId,
  onUpdated
}: Props) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (visible && patientId !== null) {
      (async () => {
        const all: Patient[] = await getStorageItem('patients') || [];
        const found = all.find((p: Patient) => p.id === patientId);
        setPatient(found || null);
      })();
    }
  }, [visible, patientId]);

  useEffect(() => {
    if (editing && patient) {
      validateFields(patient);
    }
  }, [patient]);

  const handleChange = (key: string, value: string) => {
    if (!patient) return;
    const updated = { ...patient, [key]: value };
    setPatient(updated);
  };

  const validateFields = async (current: Patient) => {
    const all: Patient[] = await getStorageItem('patients') || [];
    const others = all.filter(p => p.id !== current.id);

    const newErrors: { [key: string]: string } = {};

    if (!/^\d{10}$/.test(current.mobile)) {
      newErrors.mobile = 'Mobile must be 10 digits';
    } else if (others.some(p => p.mobile === current.mobile)) {
      newErrors.mobile = 'Mobile already exists';
    }

    if (current.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(current.email)) {
        newErrors.email = 'Invalid email format';
      } else if (others.some(p => p.email === current.email)) {
        newErrors.email = 'Email already exists';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSave = async () => {
    if (!patient || !isValid) return;

    const all: Patient[] = await getStorageItem('patients') || [];
    const updated = all.map((p: Patient) => (p.id === patient.id ? patient : p));
    await setStorageItem('patients', updated);
    onUpdated();
    onClose();
  };

  const getIcon = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      name: <FontAwesome5 name="user" size={16} color={COLORS.icon} />,
      mobile: <FontAwesome5 name="phone-alt" size={16} color={COLORS.icon} />,
      address: <Ionicons name="location" size={16} color={COLORS.icon} />,
      date: <Ionicons name="calendar" size={16} color={COLORS.icon} />,
      time: <Ionicons name="time" size={16} color={COLORS.icon} />,
      gender: <Ionicons name="male-female" size={16} color={COLORS.icon} />,
      age: <MaterialCommunityIcons name="calendar-account" size={16} color={COLORS.icon} />,
      email: <MaterialCommunityIcons name="email" size={16} color={COLORS.icon} />,
      bloodGroup: <FontAwesome5 name="tint" size={16} color={COLORS.icon} />,
      note: <FontAwesome5 name="sticky-note" size={16} color={COLORS.icon} />,
      status: <FontAwesome5 name="tasks" size={16} color={COLORS.icon} />
    };
    return icons[key] || null;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.header}>
              <Text style={styles.title}>
                <FontAwesome5 name="user-md" size={20} color={COLORS.primary} /> Patient Details
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={26} color={COLORS.danger} />
              </TouchableOpacity>
            </View>

            {patient ? (
              Object.entries(patient).map(([key, value]) => {
                if (key === 'id') return null;
                const error = errors[key];

                return (
                  <View key={key} style={styles.row}>
                    <View style={styles.labelRow}>
                      {getIcon(key)}
                      <Text style={styles.label}>{` ${key.toUpperCase()}`}</Text>
                    </View>
                    {editing ? (
                      <>
                        <TextInput
                          style={[styles.input, error && { borderColor: COLORS.danger }]}
                          value={String(value)}
                          onChangeText={(text) => handleChange(key, text)}
                          placeholder={`Enter ${key}`}
                          placeholderTextColor={COLORS.placeholder}
                          keyboardType={key === 'mobile' ? 'phone-pad' : 'default'}
                        />
                        {error && <Text style={styles.errorText}>{error}</Text>}
                      </>
                    ) : (
                      <Text style={styles.value}>{String(value)}</Text>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={{ textAlign: 'center', color: COLORS.gray }}>No data found</Text>
            )}

            {patient && (
              <TouchableOpacity
                onPress={editing ? handleSave : () => setEditing(true)}
                style={[
                  styles.button,
                  {
                    backgroundColor: editing ? COLORS.success : COLORS.danger,
                    opacity: editing && !isValid ? 0.5 : 1
                  }
                ]}
                disabled={editing && !isValid}
              >
                <Text style={styles.buttonText}>{editing ? 'Save Changes' : 'Edit'}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  row: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.light,
  },
  value: {
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 4,
  },
  button: {
    marginTop: 24,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: '800',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    marginTop: 4,
    fontSize: 13,
  },
});
