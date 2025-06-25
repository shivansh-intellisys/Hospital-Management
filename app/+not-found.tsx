// app/+not-found.tsx

import React from 'react'; 
import COLORS from '@/constants/Colors';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/404_page-not-found.png')} // ✅ Optional image (use your own or comment out)
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Oops! Page not found.</Text>
      <TouchableOpacity onPress={() => router.replace('/')} style={styles.button}>
  <Text style={styles.buttonText}>Go to Home</Text>
</TouchableOpacity>

    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
    textAlign: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.4,
  },
  button: {
  marginTop: 20,
  backgroundColor: COLORS.primary,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
buttonText: {
  color: COLORS.buttonText,
  fontWeight: 'bold',
},

});
