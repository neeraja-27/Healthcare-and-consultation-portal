import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaClock, FaUser, FaVideo, FaPhoneAlt } from "react-icons/fa";

/* ==========================================================================
   UPCOMING CONSULTATIONS COMPONENT
   --------------------------------------------------------------------------
   Dedicated page for doctors listing confirmed upcoming appointments.
   ========================================================================== */
const UpcomingConsultations = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const response = await API.get("/appointments/practitioner");
        if (response.data?.success) {
          const confirmed = (response.data.appointments || []).filter(
            (a) => a.status === "Confirmed" || a.status === "Pending"
          );
          setAppointments(confirmed);
        }
      } catch (error) {
        toast.error("Failed to load upcoming consultations.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Fetching upcoming schedule...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Upcoming Consultations</h1>
        <p style={{ color: "var(--text-muted)" }}>View and launch live virtual consultations for scheduled patient sessions.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="card flex-center" style={{ padding: "4rem 2rem", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <FaCalendarAlt style={{ fontSize: "3.5rem", color: "var(--border)" }} />
          <p style={{ fontSize: "1.1rem" }}>No upcoming consultations scheduled at this time.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {appointments.map((app) => (
            <div key={app._id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.25rem" }}>
              
              {/* Header */}
              <div className="flex-between">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {app.patient?.name ? app.patient.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{app.patient?.name}</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{app.patient?.email}</span>
                  </div>
                </div>
                <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
              </div>

              {/* Session Info */}
              <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "0.85rem 0", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaCalendarAlt style={{ color: "var(--primary)" }} /> {formatDate(app.appointmentDate)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FaClock style={{ color: "var(--secondary)" }} /> {app.timeSlot}
                </div>
                {app.reason && (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <strong>Reason:</strong> {app.reason}
                  </div>
                )}
              </div>

              {/* Action */}
              <Link
                to={`/join-consultation/${app._id}`}
                className="btn btn-primary"
                style={{ justifyContent: "center", padding: "0.6rem" }}
              >
                <FaVideo /> Launch Tele-Consultation
              </Link>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingConsultations;
