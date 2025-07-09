# 🏥 Clinic Management App (Receptionist, Patient & Doctor Modules)

A cross-platform **React Native** mobile application (using **Expo Router**) designed to simplify and manage clinic operations through role-based modules for **Receptionists**, **Patients**, and **Doctors**.

---

## 📌 Project Modules & Features

### 👩‍💼 Receptionist Module
- Add new patient profiles
- Book patient appointments
- View and manage today's appointments
- Upload prescriptions & test reports
- Track visit history of patients
- View all prescriptions
- View billing information (registration, test & medical bills)

### 🧑‍⚕️ Doctor Module (Admin Access)
- Secure login with admin privileges
- View all appointments (including pending/live ones)
- Access patient profiles and visit history
- Upload medical prescriptions and test reports
- Add doctor suggestions, medicines, and advice
- View billing for each patient

### 👨‍👩‍👧 Patient Module
- Patient login to access personal dashboard
- View profile, upcoming & past appointments
- View detailed visit history including:
  - Prescribed medicines
  - Doctor’s notes and advice
  - Uploaded test reports & prescriptions
- Download reports and prescriptions
- Access billing details

---

## 🏠 Homepage (`index.tsx`)
- Landing screen for selecting **Receptionist**, **Doctor**, or **Patient**
- Clean UI with clinic logo and welcoming intro
- No tab bar shown for guest view

---

## 🔐 Login Flow
- After role selection, users are navigated to a shared **Login Screen**
- Upon successful login:
  - Role-based **Tab Navigation** is activated
  - Different tab layouts for each module (Receptionist, Doctor, Patient)

---

## 🧭 Navigation (Routing)
- Built using **Expo Router** with file-based routing
- Each module (`/receptionist`, `/doctor`, `/patient`) contains its own `_layout.tsx` for isolated navigation structure
- Navigation and visibility managed cleanly per role
- No tab bar on initial home or login screens

---

## 📁 Folder Structure Overview



app/
├── index.tsx # Entry screen for role selection
├── auth/
│ └── login.tsx # Shared login screen
├── receptionist/
│ ├── _layout.tsx
│ ├── dashboard.tsx
│ ├── add-patient.tsx
│ ├── book-appointment.tsx
│ ├── view-appointments.tsx
│ ├── upload-report.tsx
│ ├── view-history.tsx
│ └── view-prescriptions.tsx
├── patient/
│ ├── _layout.tsx
│ ├── dashboard.tsx
│ ├── appointments.tsx
│ ├── prescriptions.tsx
│ ├── profile.tsx
│ └── visit-history.tsx
├── doctor/
│ ├── _layout.tsx
│ ├── dashboard.tsx
│ ├── appointments.tsx
│ ├── view-patient.tsx
│ ├── upload-prescription.tsx
│ └── billing.tsx
assets/
└── images/ # Logos, UI assets, icons

yaml
Copy
Edit

---

## 💻 Tech Stack

- ⚛️ **React Native (Expo)**
- 🌐 **Expo Router** (File-based routing)
- 🟦 **TypeScript**
- 📱 **React Navigation**
- 🧠 **Local Storage** using `AsyncStorage`
- 🎨 UI Icons: Font Awesome, Ionicons
- 📸 Image & file uploads (planned)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install

2. Start Expo server

npx expo start
Scan the QR code or run it on:

Android Emulator
iOS Simulator
Expo Go app on a physical device

🛠️ Planned Improvements :

🔐 Add backend authentication (Node.js or Firebase)
☁️ Integrate Firebase / SQLite for persistent cloud storage
📄 File upload: prescriptions, test reports (PDFs/Images)
🌐 Multi-language support
💳 Billing enhancements (PDF export, payment tracking)
🧩 Modularization of services/components for cleaner architecture

📃 License
This project is built and maintained by Shivansh Pandey as a part of full-stack clinic application development learning journey.


🔗 Built With

1. Expo
2. React Native
3. React Navigation
4. TypeScript
5. AsyncStorage




This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).
 

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

 