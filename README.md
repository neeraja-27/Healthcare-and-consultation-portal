# 🏥 MERN Stack Healthcare Booking & Consultation Portal

A full-stack, enterprise-grade **Healthcare Booking & Tele-Consultation Portal** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with standard Vanilla CSS design tokens and **Multi-Language Internationalization (i18n)**. 

The portal connects patients with verified medical practitioners, allowing online appointment scheduling, real-time tele-consultation rooms, medical history record management, digital prescriptions, multi-language translation, and administrator system controls.

---

## 🌐 MULTI-LANGUAGE ACCESSIBILITY (i18n)

To ensure patient accessibility across diverse demographics, we built a custom, high-performance **React Context-Based i18n System** (`LanguageContext.jsx`).

### Supported Languages:
* 🇺🇸 **English** (`en`)
* 🇪🇸 **Spanish / Español** (`es`)
* 🇮🇳 **Hindi / हिंदी** (`hi`)
* 🇮🇳 **Telugu / తెలుగు** (`te`)

### How Multi-Language Works:
1. **Globe Dropdown Selector**: Patients can switch languages at any time using the global language selector in the top navigation bar (`Header.jsx`).
2. **Session Persistence**: The chosen language is stored in `localStorage` under `app_language` so it persists across browser reloads.
3. **Translation Hook (`useLanguage`)**: Exposes a `t("key")` translation function that dynamically updates navigation labels, hero section text, trust statistics, doctor profiles, and clinical badges instantly without reloading the page.

---

## 🖥️ EVERYTHING ABOUT FRONTEND

The frontend is a single-page application (SPA) built using **React 18** and **Vite**, styled with **Standard Vanilla CSS (CSS Variables)**, and powered by **React Router DOM v7** for role-aware routing.

### 1. Frontend Directory Map
```
frontend/src/
├── components/
│   ├── Header.jsx                # Reusable navigation bar with Language Switcher Dropdown (EN, ES, FR, HI, TE)
│   └── Footer.jsx                # Reusable clinical bottom bar with multi-language links
├── context/
│   ├── AuthContext.jsx           # Global Auth state, JWT session storage & profile verification
│   └── LanguageContext.jsx       # Global i18n Multi-Language Provider & translation dictionaries
├── layouts/
│   ├── PublicLayout.jsx          # UI shell with animated hospital background effects, <Header /> & <Footer />
│   └── DashboardLayout.jsx       # UI shell for authenticated users (Role-based Left Sidebar + Top Bar)
├── pages/
│   ├── Admin/
│   │   ├── AdminDashboard.jsx    # System oversight console & practitioner license management
│   │   ├── SystemHealthCheck.jsx # API ping latency & backend database telemetry panel
│   │   └── VerifyPractitioners.jsx # Dedicated approval queue for medical licenses
│   ├── Home/
│   │   ├── About.jsx             # Platform mission, medical security, and clinical statistics
│   │   ├── Contact.jsx           # Customer helpline directory & contact support form
│   │   ├── Home.jsx              # Landing hero banner, specialty quick cards, & workflow steps
│   │   └── Services.jsx          # Department directory & specialty search list
│   ├── Login/
│   │   └── Login.jsx             # User authentication, password toggle, & role-based redirection
│   ├── Patient/
│   │   ├── BookAppointment.jsx   # Doctor selection dropdown, date picker, time slot, & reason form
│   │   ├── JoinConsultation.jsx  # Tele-consultation video screen & real-time clinical chat log
│   │   ├── MedicalHistory.jsx    # Health metrics form (Blood group, height, weight, allergies, etc.)
│   │   ├── MyAppointments.jsx    # Filterable appointment ledger with cancel action
│   │   ├── PatientDashboard.jsx  # Patient KPI metrics, upcoming bookings, & quick links
│   │   ├── Prescriptions.jsx     # Issued digital prescriptions viewer & dosage instructions
│   │   └── Profile.jsx           # Personal user profile & doctor credential manager
│   ├── Practitioner/
│   │   ├── AvailabilitySettings.jsx # Working days picker, shift operating hours, & slot duration
│   │   ├── PractitionerDashboard.jsx # Doctor workspace: approve/reject requests & issue prescription modal
│   │   ├── PractitionerDetails.jsx   # Detailed bio page for an individual doctor
│   │   ├── PractitionerList.jsx      # Doctor finder with specialty pills & search filter
│   │   ├── PrescribePanel.jsx        # Dedicated workstation to issue digital prescriptions
│   │   └── UpcomingConsultations.jsx # Confirmed patient schedule & Tele-consultation launch buttons
│   ├── Register/
│   │   └── Register.jsx          # Sign-up form with conditional practitioner fields
│   └── NotFound.jsx              # 404 Fallback error page
├── routes/
│   ├── AppRoutes.jsx             # Master URL route tree mapping
│   ├── GuestRoute.jsx            # Guard preventing logged-in users from accessing /login or /register
│   └── ProtectedRoute.jsx        # Guard enforcing authentication & RBAC allowed roles
├── services/
│   └── api.js                    # Centralized Axios client with automatic Bearer token injection
├── App.css                       # Reset styles
├── App.jsx                       # Root provider wrapper (Auth, Language, Router, Toast Container)
├── index.css                     # Global CSS variables, hospital background animations, glassmorphism
└── main.jsx                      # Vite application entry point
```

---

## 🛠️ Technology Stack Overview

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | High-performance Single Page Application (SPA) |
| **Multi-Language** | Custom React Context i18n | Multi-language translation support (EN, ES, FR, HI, TE) |
| **Client Routing** | React Router DOM v7 | Client-side routing with guarded outlets |
| **Styling** | Vanilla CSS (CSS Variables) | Standard custom design system & layout components |
| **State & HTTP** | React Context + Axios | Global JWT auth state & intercepted API client |
| **Backend Runtime** | Node.js + Express.js | Event-driven RESTful API server |
| **Database** | MongoDB Atlas + Mongoose ODM | Document database for users, appointments, histories, & prescriptions |
| **Security** | JSON Web Tokens (JWT) + BcryptJS | Stateless session authentication & password hashing |

---

## 📑 Database Schemas & Data Models

### 1. `User` Schema
* `name` (String, Required)
* `email` (String, Unique, Required)
* `password` (String, Hashed, Required)
* `role` (Enum: `["patient", "practitioner", "admin"]`, Default: `"patient"`)
* `phone` (String, Required)
* `gender` (Enum: `["Male", "Female", "Other"]`)
* *Practitioner Fields*: `specialization`, `experience`, `qualification`, `consultationFee`, `isVerified` (Boolean)

### 2. `Appointment` Schema
* `patient` (Ref: `User`, Required)
* `practitioner` (Ref: `User`, Required)
* `appointmentDate` (Date, Required)
* `timeSlot` (String, Required)
* `reason` (String, Required)
* `status` (Enum: `["Pending", "Confirmed", "Completed", "Cancelled"]`, Default: `"Pending"`)
* `paymentStatus` (Enum: `["Unpaid", "Paid"]`, Default: `"Unpaid"`)

### 3. `MedicalHistory` Schema
* `patient` (Ref: `User`, Unique, Required)
* `bloodGroup` (String), `height` (Number), `weight` (Number)
* `allergies` (String), `chronicDiseases` (String), `surgeries` (String), `medications` (String)
* `emergencyContact` (String)

### 4. `Prescription` Schema
* `appointment` (Ref: `Appointment`, Required)
* `patient` (Ref: `User`, Required)
* `practitioner` (Ref: `User`, Required)
* `diagnosis` (String, Required)
* `medicines` (Array of Strings/Objects)
* `notes` (String)

---

## 🔗 REST API Endpoint Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new account (Patient or Practitioner).
* `POST /api/auth/login` — Authenticate credentials and return JWT token.
* `GET /api/auth/profile` — Fetch currently authenticated user profile (*Requires JWT*).

### Practitioners (`/api/practitioners`)
* `GET /api/practitioners` — Fetch all medical doctors (Public/Filterable).
* `GET /api/practitioners/:id` — Fetch detailed profile for a specific practitioner.
* `PUT /api/practitioners/:id` — Update practitioner profile or toggle `isVerified` license (*Admin/Doctor*).
* `DELETE /api/practitioners/:id` — Remove doctor account (*Admin Only*).

### Appointments (`/api/appointments`)
* `POST /api/appointments/book` — Book a new appointment (*Patient Only*).
* `GET /api/appointments/my` — Fetch appointment history for logged-in patient (*Patient Only*).
* `GET /api/appointments/practitioner` — Fetch assigned patient appointments (*Practitioner Only*).
* `PUT /api/appointments/cancel/:id` — Cancel a pending booking (*Patient/Doctor*).
* `PUT /api/appointments/status/:id` — Update appointment status to Confirmed, Completed, or Cancelled (*Practitioner Only*).

### Medical History (`/api/medical-history`)
* `GET /api/medical-history/my` — Retrieve patient clinical file.
* `POST /api/medical-history` — Create initial health profile.
* `PUT /api/medical-history` — Update health metrics & emergency contacts.

### Prescriptions (`/api/prescriptions`)
* `POST /api/prescriptions` — Issue a new digital prescription (*Practitioner Only*).
* `GET /api/prescriptions/patient` — Retrieve digital prescriptions for logged-in patient.

---

## 🚀 Quickstart & Local Setup Guide

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas Connection URI)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_12345
```

Start backend development server:
```bash
npm run dev
# Express server listening on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Vite server running on http://localhost:5173
```

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
