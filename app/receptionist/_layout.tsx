import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
// import Ionicons from '@expo/vector-icons/Ionicons';

export default function PatientLayout() {
  return (
    <Tabs >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload-report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="book-appointment"
        options={{
          title: 'Book-Appoint',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
            // <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="receptionistProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      {/* ✅ HIDE this screen from the tab bar */}
      <Tabs.Screen
        name="view-patient"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
       <Tabs.Screen
        name="add-patient"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
       <Tabs.Screen
        name="view-appointments"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
      <Tabs.Screen
        name="generate-bill"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
      <Tabs.Screen
        name="receptionProfile"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
      <Tabs.Screen
        name="view-prescriptions"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
    </Tabs>
  );
}
