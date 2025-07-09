// utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStorageItem = async (key: string) => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Storage Read Error:', e);
    return null;
  }
};

export const setStorageItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage Write Error:', e);
  }
};
