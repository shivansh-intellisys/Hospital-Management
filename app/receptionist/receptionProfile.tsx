import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  UIManager,
  LayoutAnimation,
  Alert,
  KeyboardAvoidingView,
  TextInput as RNTextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '@/constants/Colors';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function ReceptionProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [dobInput, setDobInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [idProof, setIdProof] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const scrollRef = useRef<ScrollView>(null);
  const nameRef = useRef<RNTextInput>(null);
  const mobileRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const genderRef = useRef<Picker<string>>(null);
  const addressRef = useRef<RNTextInput>(null);
  const experienceRef = useRef<RNTextInput>(null);
  const qualificationRef = useRef<RNTextInput>(null);
  const idProofRef = useRef<RNTextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profileData = await AsyncStorage.getItem('profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      setName(profile.name || '');
      setMobile(profile.mobile || '');
      setEmail(profile.email || '');
      setGender(profile.gender || '');
      setDob(profile.dob ? new Date(profile.dob) : null);
      setDobInput(profile.dob || '');
      setAddress(profile.address || '');
      setExperience(profile.experience || '');
      setQualification(profile.qualification || '');
      setIdProof(profile.idProof || '');
      setProfileImage(profile.profileImage || null);
    }
  };

  const saveProfile = async () => {
    const profile = {
      name,
      mobile,
      email,
      gender,
      dob: dob?.toISOString().split('T')[0] || '',
      address,
      experience,
      qualification,
      idProof,
      profileImage,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    AsyncStorage.clear();
    router.replace('/auth/login');
    Alert.alert('Success', 'Logged out successfully');
  };

  const scrollToField = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: index * 120, animated: true });
    }
  };

  const toggleEditMode = () => {
    if (isEditing && !validateForm()) return;
    if (!isEditing) {
      setIsEditing(true);
    } else {
      saveProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    }
  };

  const handleDobChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDobInput(formattedDate);
    }
  };

  const getFieldIndex = (field: string): number => {
    const fieldOrder = ['name', 'mobile', 'email', 'gender', 'dob', 'address', 'experience', 'qualification', 'idProof'];
    return fieldOrder.indexOf(field);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) newErrors.name = true;
    if (!phoneRegex.test(mobile)) newErrors.mobile = true;
    if (!emailRegex.test(email)) newErrors.email = true;
    if (!gender.trim()) newErrors.gender = true;
    if (!dob) newErrors.dob = true;
    if (!address.trim()) newErrors.address = true;
    if (!experience.trim()) newErrors.experience = true;
    if (!qualification.trim()) newErrors.qualification = true;
    if (!idProof.trim()) newErrors.idProof = true;

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstField = errorKeys[0];
      scrollToField(getFieldIndex(firstField));
      const errorMessages: { [key: string]: string } = {
        name: 'Name is required',
        mobile: 'Mobile number must be 10 digits',
        email: 'Enter a valid email address',
        gender: 'Gender is required',
        dob: 'Date of Birth is required',
        address: 'Address is required',
        experience: 'Experience is required',
        qualification: 'Qualification is required',
        idProof: 'ID Proof is required',
      };
      Alert.alert('Validation Error', errorMessages[firstField]);
      return false;
    }
    return true;
  };

  const calculateProfileCompletion = () => {
    const fields = [name, mobile, email, gender, dobInput, address, experience, qualification, idProof];
    const filled = fields.filter((field) => field && (typeof field === 'string' ? field.trim() !== '' : true));
    return Math.floor((filled.length / fields.length) * 100);
  };

  const completionPercent = calculateProfileCompletion();
  const progressBarColor = completionPercent < 60 ? COLORS.danger : COLORS.success;
  const getFieldStyle = (field: string) => [styles.field, errors[field] && styles.errorShadow];
  const getInputStyle = () => [styles.input];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} style={styles.wrapper} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Animated.View entering={FadeInDown.duration(700)} style={styles.header}>
            <Text style={styles.headerText}>
              <FontAwesome5 name="user-circle" size={20} color={COLORS.primary} /> Receptionist Profile
            </Text>
          </Animated.View>

          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} disabled={!isEditing}>
            <Image
              source={profileImage ? { uri: profileImage } : require('@/assets/images/receptionist-avatar.png')}
              style={styles.image}
            />
            {isEditing && (
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${completionPercent}%`, backgroundColor: progressBarColor }]} />
          </View>
          <Text style={[styles.progressText, { color: progressBarColor }]}>Profile Completion: {completionPercent}%</Text>

          <View style={getFieldStyle('name')}><FontAwesome5 name="user" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={nameRef} returnKeyType="next" onSubmitEditing={() => mobileRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={name} onChangeText={setName} placeholder="Name *" /></View>

          <View style={getFieldStyle('mobile')}><FontAwesome5 name="phone" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={mobileRef} returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={mobile} onChangeText={setMobile} placeholder="Mobile *" keyboardType="phone-pad" /></View>

          <View style={getFieldStyle('email')}><MaterialIcons name="email" style={styles.icon} size={18} color={COLORS.primary} /><TextInput ref={emailRef} returnKeyType="next" onSubmitEditing={() => addressRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={email} onChangeText={setEmail} placeholder="Email *" keyboardType="email-address" /></View>

          <View style={getFieldStyle('gender')}>
            <Ionicons name="male-female-outline" style={styles.icon} size={18} color={COLORS.primary} />
            <Picker enabled={isEditing} selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={{ flex: 1 }}>
              <Picker.Item label="Select Gender *" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={getFieldStyle('dob')}>
            <FontAwesome5 name="calendar" style={styles.icon} size={16} color={COLORS.primary} />
            <TouchableOpacity onPress={() => isEditing && setShowDatePicker(true)}>
              <Text style={[styles.input, { paddingTop: 10 }]}>{dob?.toDateString() || 'Select Date *'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display="default"
                onChange={handleDobChange}
              />
            )}
          </View>

          <View style={getFieldStyle('address')}><FontAwesome5 name="map-marker-alt" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={addressRef} returnKeyType="next" onSubmitEditing={() => experienceRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={address} onChangeText={setAddress} multiline placeholder="Address *" /></View>

          <View style={getFieldStyle('experience')}><FontAwesome5 name="briefcase" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={experienceRef} returnKeyType="next" onSubmitEditing={() => qualificationRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={experience} onChangeText={setExperience} placeholder="Experience *" /></View>

          <View style={getFieldStyle('qualification')}><FontAwesome5 name="graduation-cap" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={qualificationRef} returnKeyType="next" onSubmitEditing={() => idProofRef.current?.focus()} editable={isEditing} style={getInputStyle()} value={qualification} onChangeText={setQualification} placeholder="Qualification *" /></View>

          <View style={getFieldStyle('idProof')}><FontAwesome5 name="id-card" style={styles.icon} size={16} color={COLORS.primary} /><TextInput ref={idProofRef} editable={isEditing} style={getInputStyle()} value={idProof} onChangeText={setIdProof} placeholder="ID Proof *" /></View>

        </View>
        <Animated.View entering={FadeInDown.delay(300).duration(700)} style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
            <Text style={styles.buttonText}>{isEditing ? 'Save Profile' : 'Edit Profile'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 10,
  },
  headerText: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  imageContainer: { alignSelf: 'center', marginBottom: 20, position: 'relative' },
  image: { width: 120, height: 120, borderRadius: 100, borderWidth: 3, borderColor: COLORS.primary },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorShadow: {
    borderColor: COLORS.danger,
    borderWidth: 2,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
    gap: 15,
    padding: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
   logoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

   
