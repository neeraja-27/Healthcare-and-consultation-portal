import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Public Pages
import Home from "../pages/Home/Home";
import About from "../pages/Home/About";
import Services from "../pages/Home/Services";
import Contact from "../pages/Home/Contact";
import PractitionerList from "../pages/Practitioner/PractitionerList";
import PractitionerDetails from "../pages/Practitioner/PractitionerDetails";

// Auth Pages (Guest Only)
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Patient Pages (Patient Only)
import PatientDashboard from "../pages/Patient/PatientDashboard";
import BookAppointment from "../pages/Patient/BookAppointment";
import MyAppointments from "../pages/Patient/MyAppointments";
import MedicalHistory from "../pages/Patient/MedicalHistory";
import Prescriptions from "../pages/Patient/Prescriptions";
import JoinConsultation from "../pages/Patient/JoinConsultation";

// Practitioner Pages (Practitioner Only)
import PractitionerDashboard from "../pages/Practitioner/PractitionerDashboard";
import AvailabilitySettings from "../pages/Practitioner/AvailabilitySettings";
import UpcomingConsultations from "../pages/Practitioner/UpcomingConsultations";
import PrescribePanel from "../pages/Practitioner/PrescribePanel";

// Admin Pages (Admin Only)
import AdminDashboard from "../pages/Admin/AdminDashboard";
import VerifyPractitioners from "../pages/Admin/VerifyPractitioners";
import SystemHealthCheck from "../pages/Admin/SystemHealthCheck";

// Shared Protected Pages
import Profile from "../pages/Patient/Profile";
import NotFound from "../pages/NotFound";

/* ==========================================================================
   MASTER APP ROUTES COMPONENT
   --------------------------------------------------------------------------
   Maps URL paths to their respective React pages and protects layouts/routes
   with role-based verification.
   ========================================================================== */
const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/practitioners" element={<PractitionerList />} />
        <Route path="/practitioners/:id" element={<PractitionerDetails />} />
      </Route>

      {/* 2. GUEST-ONLY ROUTES */}
      <Route element={<GuestRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* 3. PATIENT-ONLY DASHBOARD ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
        </Route>
      </Route>

      {/* 4. PRACTITIONER-ONLY DASHBOARD ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["practitioner"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/practitioner-dashboard" element={<PractitionerDashboard />} />
          <Route path="/availability-settings" element={<AvailabilitySettings />} />
          <Route path="/upcoming-consultations" element={<UpcomingConsultations />} />
          <Route path="/prescribe-panel" element={<PrescribePanel />} />
        </Route>
      </Route>

      {/* 5. ADMIN-ONLY DASHBOARD ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/verify-practitioners" element={<VerifyPractitioners />} />
          <Route path="/system-health" element={<SystemHealthCheck />} />
        </Route>
      </Route>

      {/* 6. SHARED TELEMEDICINE & AUTHENTICATED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["patient", "practitioner", "admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/join-consultation" element={<JoinConsultation />} />
          <Route path="/join-consultation/:appointmentId" element={<JoinConsultation />} />
        </Route>
      </Route>

      {/* 7. FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
