import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaFilePrescription,
  FaPlusCircle,
  FaChevronRight,
  FaTimes,
  FaVial,
  FaClipboardList
} from "react-icons/fa";

/* ==========================================================================
   PATIENT DASHBOARD COMPONENT
   --------------------------------------------------------------------------
   Renders patient appointment overview, active prescriptions count, and
   blood group details safely.
   ========================================================================== */
const PatientDashboard = () => {
  const { user } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data concurrently
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments
      try {
        const appointmentsRes = await API.get("/appointments/my");
        if (appointmentsRes.data?.success) {
          setAppointments(appointmentsRes.data.appointments || []);
        }
      } catch (appErr) {
        console.error("Error loading patient appointments:", appErr);
      }

      // Fetch prescriptions
      try {
        const prescriptionsRes = await API.get("/prescriptions/patient");
        if (prescriptionsRes.data?.success) {
          setPrescriptions(prescriptionsRes.data.prescriptions || []);
        }
      } catch (prescErr) {
        console.error("Error loading patient prescriptions:", prescErr);
      }

      // Fetch medical history (404 is acceptable if patient hasn't filled profile yet)
      try {
        const historyRes = await API.get("/medical-history/my");
        if (historyRes.data?.success) {
          setMedicalHistory(historyRes.data.medicalHistory);
        }
      } catch (historyErr) {
        // Silently catch 404 for uncreated history profile
      }

    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await API.put(`/appointments/cancel/${appointmentId}`);
      if (response.data?.success) {
        toast.success("Appointment cancelled successfully.");
        fetchDashboardData();
      } else {
        toast.error(response.data?.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment.");
    }
  };

  // Safe Array Helpers
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];

  const pendingAppointments = safeAppointments.filter(app => app?.status === "Pending");
  const activeAppointments = safeAppointments.filter(app => app?.status === "Pending" || app?.status === "Confirmed");
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Fetching patient dashboard records...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 1. Welcoming Title */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem", color: "var(--primary-deep)" }}>
            Hello, {user?.name || "Patient"}!
          </h1>
          <p style={{ color: "var(--text-muted)" }}>Here is an overview of your medical portal activity.</p>
        </div>
        <Link to="/book-appointment" className="btn btn-primary">
          <FaPlusCircle /> Book New Consultation
        </Link>
      </div>

      {/* 2. Overview Metrics Cards Row */}
      <div className="grid-cols-3" style={{ marginBottom: "2.5rem" }}>
        
        {/* Total Appointments Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem"
          }}>
            <FaCalendarCheck />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)", lineHeight: 1.2 }}>
              {safeAppointments.length}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Total Bookings ({pendingAppointments.length} Pending)
            </div>
          </div>
        </div>

        {/* Total Prescriptions Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--secondary-light)",
            color: "var(--secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem"
          }}>
            <FaFilePrescription />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)", lineHeight: 1.2 }}>
              {safePrescriptions.length}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Active Prescriptions
            </div>
          </div>
        </div>

        {/* Blood Group Card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--danger-light)",
            color: "var(--danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem"
          }}>
            <FaVial />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)", lineHeight: 1.2 }}>
              {medicalHistory?.bloodGroup || "N/A"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Blood Type ({medicalHistory ? "Verified" : "Not Set"})
            </div>
          </div>
        </div>

      </div>

      {/* 3. Upcoming Consultations */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary-deep)" }}>Active & Upcoming Consultations</h3>
          <Link to="/my-appointments" style={{ fontSize: "0.85rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            View All <FaChevronRight style={{ fontSize: "0.75rem" }} />
          </Link>
        </div>

        {activeAppointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)" }}>
            <p>You have no active pending or confirmed appointments.</p>
            <Link to="/book-appointment" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.9rem", fontWeight: 600 }}>
              Book your appointment now
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {activeAppointments.slice(0, 3).map((app) => (
              <div key={app._id} className="flex-between" style={{
                padding: "1rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-app)",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div style={{ fontWeight: 600, color: "var(--primary-deep)" }}>
                    Dr. {app.practitioner?.name || "Doctor"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    {app.practitioner?.specialization || "General Practice"} | Fee: ${app.practitioner?.consultationFee || 0}
                  </div>
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--text-main)", fontWeight: 500 }}>
                    {formatDate(app.appointmentDate)} at {app.timeSlot}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className={`badge badge-${app.status?.toLowerCase()}`}>
                    {app.status}
                  </span>
                  
                  {app.status === "Pending" && (
                    <button
                      onClick={() => handleCancelAppointment(app._id)}
                      className="btn btn-outline"
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", color: "var(--danger)" }}
                    >
                      <FaTimes /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PatientDashboard;
