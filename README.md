

# 🏥 Clinic Management App (Receptionist & Patient Module)

This is a mobile application built with **React Native (using Expo Router)** that provides a streamlined interface for managing a clinic’s operations for both **Receptionists** and **Patients**.

## 📱 Features

### 👥 Role-Based Modules
- **Receptionist**
  - Add New Patient
  - Book Appointment
  - View Appointments
  - Upload Reports
  - View History
  - View Prescriptions

- **Patient**
  - Login to access dashboard
  - View Appointments
  - View Prescriptions
  - Profile Management

---

### 🏠 Homepage (index.tsx)
- Acts as the entry point of the app.
- Allows users to select either **Receptionist** or **Patient** mode.
- Contains clinic logo and introductory text.
- No tab bar is shown here to keep it clean.

---

### 🔐 Login Flow
- After selecting a role, users are redirected to a **Login Page**.
- After successful login:
  - Role-based **Tab Navigation** is enabled.
  - Tabs differ for Receptionist and Patient.

---

### 🧭 Navigation Logic
- **Expo Router** with file-based routing.
- Custom `_layout.tsx` in each module folder (`/receptionist`, `/patient`) to manage tab bar visibility and screens.
- Tab bar only shows after login.

---

## 📂 Folder Structure

app/
├── index.tsx # Home page (Receptionist & Patient selection)
├── auth/
│ └── login.tsx # Shared login page
├── receptionist/
│ ├── _layout.tsx # Tab layout for receptionist
│ ├── dashboard.tsx # Receptionist dashboard
│ ├── add-patient.tsx
│ ├── book-appointment.tsx
│ ├── view-appointments.tsx
│ ├── upload-report.tsx
│ ├── view-history.tsx
│ └── view-prescriptions.tsx
├── patient/
│ ├── _layout.tsx # Tab layout for patient
│ ├── dashboard.tsx
│ ├── appointments.tsx
│ ├── prescriptions.tsx
│ └── profile.tsx
assets/
├── images/ # All UI images (doctors, logo, icons etc.)

 
---

## 💻 Tech Stack

- **React Native**
- **Expo (with Expo Router)**
- **TypeScript**
- **React Navigation**
- **Icons**: Ionicons, Font Awesome
- **Local Navigation State** (no backend yet)

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start Expo server
npx expo start

# 3. Run on Android/iOS emulator or scan QR on real device


🛠️ Planned Improvements
🔐 Add authentication with backend

🧾 Store data in Firebase or SQLite

📤 Upload & fetch reports (PDFs/Images)

🌐 Multi-language support

🧩 Modular codebase with services & components











This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

 