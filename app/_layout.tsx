// import NavigationMenu from '@/components/NavigationMenu';
// import { Stack } from 'expo-router';
// import { SafeAreaProvider } from 'react-native-safe-area-context';


// export default function Layout() {
//   return (
//     <SafeAreaProvider>
//       <NavigationMenu />
//       <Stack />
//     </SafeAreaProvider>
//   );
// }

// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="receptionist" />
      <Stack.Screen name="patient" />
    </Stack>
  );
}
