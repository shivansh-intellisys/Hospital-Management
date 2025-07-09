import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert,
  ActivityIndicator, TouchableOpacity, Pressable
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import COLORS from "@/constants/Colors";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import PatientDetailsModal from "@/components/ui/PatientDetailsModal";
import { Patient } from "@/types/Patient";




type SortOption = 'all' | 'new' | 'pending' | 'completed';

export default function ViewPatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [visiblePatients, setVisiblePatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("all");

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();

  const fetch = async () => {
    const stored = await AsyncStorage.getItem("patients");
    const list = stored ? JSON.parse(stored) : [];
    setPatients(list);
    setLoading(false); // removed applyFilters here
  };

  const parseDateTime = (date: string, time: string): number => {
    const [year, month, day] = date.split("-").map(Number);
    let [hour, minutePart] = time.split(":");
    let [minute, meridiem] = minutePart.split(" ");

    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    if (meridiem?.toLowerCase() === "pm" && h !== 12) h += 12;
    else if (meridiem?.toLowerCase() === "am" && h === 12) h = 0;

    return new Date(year, month - 1, day, h, m).getTime();
  };

  const applyFilters = (list: Patient[]) => {
    let r = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.date.includes(search)
    );

    if (fromDate) r = r.filter((p) => new Date(p.date) >= fromDate);
    if (toDate) r = r.filter((p) => new Date(p.date) <= toDate);

    switch (sort) {
      case "all":
        break;
      case "new":
        r = r.sort((a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time));
        break;
      case "pending":
        r = r.filter((p) => p.status !== "completed");
        break;
      case "completed":
        r = r.filter((p) => p.status === "completed");
        break;
    }

    setFiltered(r);
    setVisiblePatients(r.slice(0, page * limit));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setVisiblePatients(filtered.slice(0, nextPage * limit));
  };

  useEffect(() => {
    applyFilters(patients);
  }, [sort, fromDate, toDate, search, page, patients]); // <- updated dependency array

  useFocusEffect(React.useCallback(() => { fetch(); }, []));

  const onSearch = (text: string) => setSearch(text);

  const handleDelete = (id: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this patient?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          const updated = patients.filter(p => p.id !== id);
          await AsyncStorage.setItem("patients", JSON.stringify(updated));
          setPatients(updated);
        }
      }
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Animated.Text entering={FadeInDown.duration(800)} style={styles.title}>
          <FontAwesome5 name="clipboard-list" size={22} color={COLORS.primary} /> All Patients
        </Animated.Text>

        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or date"
            placeholderTextColor={COLORS.placeholder}
            value={search}
            onChangeText={onSearch}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.dateRangeBox}>
            <Pressable style={styles.dateBox} onPress={() => setShowFrom(true)}>
              <Text style={styles.dateText}>{fromDate ? fromDate.toISOString().split("T")[0] : "From Date"}</Text>
            </Pressable>
            {showFrom && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, d) => {
                  setShowFrom(false);
                  if (d) setFromDate(d);
                }}
              />
            )}
            <Pressable style={styles.dateBox} onPress={() => setShowTo(true)}>
              <Text style={styles.dateText}>{toDate ? toDate.toISOString().split("T")[0] : "To Date"}</Text>
            </Pressable>
            {showTo && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display="default"
                onChange={(_, d) => {
                  setShowTo(false);
                  if (d) setToDate(d);
                }}
              />
            )}
          </View>

          <View style={styles.sortBox}>
            <Picker
              selectedValue={sort}
              onValueChange={(v: SortOption) => { setSort(v); setPage(1); }}
              style={styles.picker}
              dropdownIconColor={COLORS.text}
            >
              <Picker.Item label="All List" value="all" />
              <Picker.Item label="Newest" value="new" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Completed" value="completed" />
            </Picker>
          </View>
        </View>

        {/* Patient Cards */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : visiblePatients.length === 0 ? (
          <Text style={styles.noData}>No patients found.</Text>
        ) : visiblePatients.map((p) => (
          <Animated.View key={p.id} entering={FadeInDown.delay(100).duration(300)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.patientName}>{p.name}</Text>
              <Text style={styles.patientId}>#{p.id}</Text>
            </View>
            <Text style={styles.info}><Ionicons name="call" size={14} /> {p.mobile}</Text>
            <Text style={styles.info}><Ionicons name="location" size={14} /> {p.address}</Text>
            <Text style={styles.info}><Ionicons name="calendar" size={14} /> {p.date} <Ionicons name="time" size={14} /> {p.time}</Text>

            <View style={styles.actionRow}>
              <Text style={[styles.badge, {
                backgroundColor: p.status === "completed" ? COLORS.success : COLORS.warning,
              }]}>
                {p.status === "completed" ? "Completed" : "Pending"}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/patient/patientDashboard?id=${p.id}`)}
                style={[
                 styles.badge, {backgroundColor:COLORS.gray}
                ]}
              >
                <Text style={{ textAlign: 'center', color: '#fff' }}>
                  View Profile
                </Text>
              </TouchableOpacity>


              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => {
                  setSelectedPatientId(p.id);
                  setModalVisible(true);
                }}>
                  <FontAwesome5 name="eye" size={18} color={COLORS.icon} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(p.id)}>
                  <FontAwesome5 name="trash" size={18} color={COLORS.danger} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}

        {visiblePatients.length < filtered.length && (
          <TouchableOpacity style={styles.loadMore} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <PatientDetailsModal
        visible={modalVisible}
        patientId={selectedPatientId}
        onClose={() => setModalVisible(false)}
        onUpdated={() => {
          setModalVisible(false);
          fetch();
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/receptionist/add-patient")}>
        <Ionicons name="add" size={28} color={COLORS.buttonText} />
      </TouchableOpacity>
    </View>
  );
}
 


const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.primary,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  dateRangeBox: { flexDirection: "row", gap: 6, width: "59%" },
  dateBox: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: { color: COLORS.text, fontSize: 14 },

  sortBox: {
    width: "41%",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 42,
    justifyContent: "center",
  },
  picker: { color: COLORS.text, height: 50, width: "100%" },

  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  patientName: { fontWeight: "700", color: COLORS.primary, fontSize: 16 },
  patientId: { fontSize: 13, color: COLORS.gray },
  info: { fontSize: 14, color: COLORS.text, marginBottom: 2 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 14,
  },
  icon: {
    padding: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 14,
    color: COLORS.buttonText,
    overflow: "hidden",
  },

  loadMore: {
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 16,
    marginTop: 40,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: 30,
    elevation: 5,
  },
});
