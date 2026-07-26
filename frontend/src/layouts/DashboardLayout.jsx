import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaThLarge,
  FaCalendarPlus,
  FaCalendarAlt,
  FaFileMedical,
  FaPills,
  FaUser,
  FaVideo,
  FaClock,
  FaPrescription,
  FaUserCheck,
  FaHeartbeat,
  FaSignOutAlt
} from "react-icons/fa";

/* ==========================================================================
   DASHBOARD LAYOUT COMPONENT
   --------------------------------------------------------------------------
   Role-aware sidebar layout for Patient, Practitioner, and Admin workspaces.
   ========================================================================== */
const DashboardLayout = () => {
  const { user, logout, isPatient, isPractitioner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      
      {/* Left Sidebar Navigation */}
      <aside style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>
        {/* Brand */}
        <Link to="/" style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
          borderBottom: "1px solid var(--border)",
          gap: "0.5rem",
          fontWeight: 800,
          color: "var(--primary-deep)",
          fontSize: "1.25rem",
          textDecoration: "none"
        }}>
          <FaHeartbeat style={{ color: "var(--primary)", fontSize: "1.6rem" }} />
          <span>Health<span style={{ color: "var(--primary)" }}>Portal</span></span>
        </Link>

        {/* Sidebar Nav Items */}
        <nav style={{ flexGrow: 1, padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "0.4rem", overflowY: "auto" }}>
          
          {/* PATIENT LINKS */}
          {isPatient && (
            <>
              <NavLink to="/patient-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaThLarge /> Dashboard
              </NavLink>
              <NavLink to="/book-appointment" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaCalendarPlus /> Book Appointment
              </NavLink>
              <NavLink to="/my-appointments" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaCalendarAlt /> My Appointments
              </NavLink>
              <NavLink to="/medical-history" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaFileMedical /> Medical History
              </NavLink>
              <NavLink to="/prescriptions" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaPills /> Prescriptions
              </NavLink>
              <NavLink to="/join-consultation" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaVideo /> Join Consultation
              </NavLink>
            </>
          )}

          {/* PRACTITIONER LINKS */}
          {isPractitioner && (
            <>
              <NavLink to="/practitioner-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaThLarge /> Dashboard
              </NavLink>
              <NavLink to="/upcoming-consultations" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaCalendarAlt /> Upcoming Consultations
              </NavLink>
              <NavLink to="/availability-settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaClock /> Availability Settings
              </NavLink>
              <NavLink to="/prescribe-panel" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaPrescription /> Prescribe Panel
              </NavLink>
              <NavLink to="/join-consultation" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaVideo /> Tele-Consultation Room
              </NavLink>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <NavLink to="/admin-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaThLarge /> Admin Overview
              </NavLink>
              <NavLink to="/verify-practitioners" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaUserCheck /> Verify Practitioners
              </NavLink>
              <NavLink to="/system-health" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaHeartbeat /> System Health Check
              </NavLink>
            </>
          )}

          {/* COMMON PROFILE LINK */}
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <FaUser /> Profile Settings
          </NavLink>

        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "flex-start", gap: "0.75rem", border: "none", color: "var(--danger)" }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 2rem",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "var(--primary-deep)", fontSize: "0.95rem" }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize", fontWeight: 600 }}>
                {user?.role || "Account"} Portal
              </div>
            </div>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              boxShadow: "var(--shadow-sm)"
            }}>
              {userInitial}
            </div>
          </div>
        </header>

        <main style={{ padding: "2rem", flexGrow: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          color: var(--text-main);
          border-radius: var(--radius-md);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
          font-size: 0.9rem;
        }
        .sidebar-link:hover {
          background-color: var(--bg-app);
          color: var(--primary);
        }
        .sidebar-link.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
        .sidebar-link svg {
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
