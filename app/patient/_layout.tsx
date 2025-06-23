// import { Tabs } from 'expo-router';

// export default function PatientTabs() {
//   return (
//     <Tabs>
//       <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
//       <Tabs.Screen name="my-appointments" options={{ title: "Appointmentsss" }} />
//       <Tabs.Screen name="my-reports" options={{ title: "Reports" }} />
//     </Tabs>
//   );
// }

import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
// import Ionicons from '@expo/vector-icons/Ionicons';

export default function PatientLayout() {
  return (
    <Tabs >
      <Tabs.Screen
        name="patientDashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-prescriptions"
        options={{
          title: 'Prescriptions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
            // <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="userProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      {/* ✅ HIDE this screen from the tab bar */}
      <Tabs.Screen
        name="my-reports"
        options={{
          href: null, // Hides this screen from tab bar
        }}
      />
    </Tabs>
  );
}
