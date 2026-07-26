import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaStethoscope, FaClock, FaDollarSign, FaTimes, FaInbox } from "react-icons/fa";

/* ==========================================================================
   MY APPOINTMENTS COMPONENT
   --------------------------------------------------------------------------
   Renders the complete list of appointments for the logged-in patient. Includes
   filtering by status and options to cancel pending sessions.
   ========================================================================== */
const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/appointments/my");
      if (response.data?.success) {
        setAppointments(response.data.appointments);
        setFilteredAppointments(response.data.appointments);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments whenever the filter category or the master list changes
  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((app) => app.status === statusFilter)
      );
    }
  }, [statusFilter, appointments]);

  // Handle appointment cancellation
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await API.put(`/appointments/cancel/${id}`);
      if (response.data?.success) {
        toast.success("Appointment cancelled successfully.");
        // Re-fetch list to sync states
        fetchAppointments();
      } else {
        toast.error(response.data?.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment.");
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading appointment list...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>My Appointments</h1>
        <p style={{ color: "var(--text-muted)" }}>View and manage your scheduled clinical consultations.</p>
      </div>

      {/* Filter Tabs Row */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "2rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--border)"
      }}>
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn ${statusFilter === status ? "btn-primary" : "btn-outline"}`}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              borderRadius: "20px",
              whiteSpace: "nowrap"
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="card flex-center" style={{ padding: "4rem 2rem", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <FaInbox style={{ fontSize: "3rem", color: "var(--border)" }} />
          <p style={{ fontSize: "1.05rem" }}>No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} appointments found.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredAppointments.map((app) => (
            <div key={app._id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
              
              {/* Card Header (Doctor & Status) */}
              <div className="flex-between">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700
                  }}>
                    {app.practitioner?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", margin: 0 }}>Dr. {app.practitioner?.name}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FaStethoscope /> {app.practitioner?.specialization}
                    </span>
                  </div>
                </div>
                <span className={`badge badge-${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </div>

              {/* Appointment details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                  <FaCalendarAlt style={{ color: "var(--primary)" }} />
                  <span>{formatDate(app.appointmentDate)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                  <FaClock style={{ color: "var(--secondary)" }} />
                  <span>Time Slot: {app.timeSlot}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                  <FaDollarSign style={{ color: "var(--warning)" }} />
                  <span>Consultation Fee: ${app.practitioner?.consultationFee}</span>
                </div>
                {app.reason && (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    <strong>Reason:</strong> {app.reason}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex-between" style={{ fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Payment Status:{" "}
                  <strong style={{ color: app.paymentStatus === "Paid" ? "var(--success)" : "var(--warning)" }}>
                    {app.paymentStatus}
                  </strong>
                </span>

                {app.status === "Pending" && (
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-outline"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      color: "var(--danger)",
                      borderColor: "rgba(239, 68, 68, 0.2)",
                      backgroundColor: "var(--danger-light)"
                    }}
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
  );
};

export default MyAppointments;
