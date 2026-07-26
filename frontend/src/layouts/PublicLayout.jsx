import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPlus, FaHeartbeat, FaStethoscope, FaPrescription } from "react-icons/fa";

/* ==========================================================================
   PUBLIC LAYOUT COMPONENT
   --------------------------------------------------------------------------
   Layout wrapper for all public-facing pages (Home, Practitioners, Services,
   About, Contact). Incorporates animated hospital background ambient effects,
   floating medical cross particles, glowing gradient spheres, and reusable
   <Header /> and <Footer /> components.
   ========================================================================== */
const PublicLayout = () => {
  return (
    <div className="hospital-bg-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      
      {/* 1. Animated Ambient Hospital Glowing Gradient Orbs */}
      <div className="hospital-glow-orb-1"></div>
      <div className="hospital-glow-orb-2"></div>

      {/* 2. Floating Hospital Theme Medical Icons */}
      <FaPlus className="floating-medical-icon" style={{ top: "12%", left: "5%", fontSize: "2.2rem", animationDelay: "0s" }} />
      <FaHeartbeat className="floating-medical-icon" style={{ top: "25%", right: "6%", fontSize: "2.5rem", animationDelay: "2s" }} />
      <FaStethoscope className="floating-medical-icon" style={{ top: "60%", left: "4%", fontSize: "2.8rem", animationDelay: "4s" }} />
      <FaPrescription className="floating-medical-icon" style={{ top: "75%", right: "5%", fontSize: "2.2rem", animationDelay: "1s" }} />
      <FaPlus className="floating-medical-icon" style={{ top: "85%", left: "15%", fontSize: "1.8rem", animationDelay: "3s" }} />

      {/* 3. Reusable Navbar Header */}
      <Header />

      {/* 4. Heartbeat ECG Line Graphic Divider */}
      <div className="ecg-line-overlay"></div>

      {/* 5. Dynamic Page View Content */}
      <main style={{ flexGrow: 1, position: "relative", zIndex: 2 }}>
        <Outlet />
      </main>

      {/* 6. Reusable Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
