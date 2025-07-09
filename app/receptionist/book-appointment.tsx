import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import { Patient, VisitHistoryEntry } from "@/types/Patient";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BookAppointmentScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointmentsToday, setAppointmentsToday] = useState<Patient[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const today = new Date().toISOString().split("T")[0];

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await AsyncStorage.getItem("patients");
        const apptData = await AsyncStorage.getItem("appointments");
        if (data) {
          const parsed: Patient[] = JSON.parse(data);
          setPatients(parsed);
        }
        if (apptData) {
          const parsed: Patient[] = JSON.parse(apptData);
          const todays = parsed.filter((a) => a.date === today);
          setAppointmentsToday(todays);
        }
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredPatients([]);
      return;
    }

    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.mobile.includes(searchText)
    );
    setFilteredPatients(filtered);
  }, [searchText, patients]);

  const handleBookAppointment = async (selectedPatient: Patient) => {
   const newVisit: VisitHistoryEntry = {
  id: Date.now().toString(),
  date: today,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  department: selectedPatient.department || 'General',
  doctor: selectedPatient.doctor || 'Not Assigned',
  status: 'pending',
};



    const updatedPatients: Patient[] = patients.map((p) => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          status: "pending",
          date: today,
          time: new Date().toLocaleTimeString(),
          visitHistory: [...(p.visitHistory || []), newVisit],
        };
      }
      return p;
    });

    await AsyncStorage.setItem("patients", JSON.stringify(updatedPatients));
    setPatients(updatedPatients);

    const todayData = await AsyncStorage.getItem("appointments");
    const appointmentList: Patient[] = todayData ? JSON.parse(todayData) : [];

   appointmentList.push({
  ...selectedPatient,
  status: "pending",
  date: today,
  time: new Date().toLocaleTimeString(),
  department: selectedPatient.department || 'General',
  doctor: selectedPatient.doctor || 'Not Assigned',
  visitHistory: [...(selectedPatient.visitHistory || []), newVisit],
});


    await AsyncStorage.setItem("appointments", JSON.stringify(appointmentList));
    setAppointmentsToday([...appointmentsToday, selectedPatient]);

    Alert.alert("Success", "Appointment booked successfully.");
    setSearchText("");
    setFilteredPatients([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleRow}>
        <FontAwesome5
          name="calendar-check"
          size={22}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.titleText}>Book Appointment</Text>
      </View>

      <TextInput
        placeholder="Search patient by name or mobile"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      {filteredPatients.length > 0 &&
        filteredPatients.map((patient) => {
         const isBookedToday = patient.visitHistory?.some(
              (entry) => entry.date === today
            );


          return (
            <View key={patient.id} style={styles.card}>
              <Text style={styles.label}>Name: {patient.name}</Text>
              <Text style={styles.label}>Mobile: {patient.mobile}</Text>
              <Text style={styles.label}>Address: {patient.address}</Text>

              {isBookedToday && (
                <Text style={styles.alreadyBooked}>🟢 Already Booked Today</Text>
              )}

              <TouchableOpacity
                style={[styles.bookBtn, isBookedToday && { backgroundColor: COLORS.disabled }]}
                onPress={() => {
                  if (isBookedToday) return;
                  Alert.alert(
                    "Confirm Booking",
                    `Are you sure you want to book an appointment for ${patient.name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Confirm", onPress: () => handleBookAppointment(patient) },
                    ]
                  );
                }}
                disabled={isBookedToday}
              >
                <Text style={styles.btnText}>
                  {isBookedToday ? "Already Booked" : "Confirm Booking"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
  },
  input: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.card,
    color: COLORS.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: COLORS.text,
  },
  bookBtn: {
    marginTop: 20,
    backgroundColor: COLORS.success,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
  },
  alreadyBooked: {
    marginTop: 8,
    color: COLORS.success,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
