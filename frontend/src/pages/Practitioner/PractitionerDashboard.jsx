import { useState, useEffect } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaPrescription,
  FaClock,
  FaCalendarAlt
} from "react-icons/fa";

/* ==========================================================================
   PRACTITIONER DASHBOARD COMPONENT
   --------------------------------------------------------------------------
   Doctor workspace rendering patient appointment requests, status toggles,
   and prescription issuance modal safely.
   ========================================================================== */
const PractitionerDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for issuing prescription
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmittingPrescription, setIsSubmittingPrescription] = useState(false);

  // Fetch appointments assigned to practitioner
  const fetchPractitionerAppointments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/appointments/practitioner");
      if (response.data?.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.error("Failed to load doctor appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractitionerAppointments();
  }, []);

  // Update appointment status handler
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await API.put(`/appointments/status/${appointmentId}`, { status: newStatus });
      if (response.data?.success) {
        toast.success(`Appointment status set to ${newStatus}`);
        fetchPractitionerAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update appointment status.");
    }
  };

  // Submit new prescription handler
  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    if (!diagnosis || !medicines) {
      toast.error("Diagnosis and medicines are required.");
      return;
    }

    setIsSubmittingPrescription(true);
    try {
      const medList = medicines.split(",").map(m => m.trim()).filter(Boolean);

      const response = await API.post("/prescriptions", {
        appointment: selectedAppointment._id,
        diagnosis,
        medicines: medList,
        notes,
      });

      if (response.data?.success) {
        toast.success("Prescription issued successfully!");
        setSelectedAppointment(null);
        setDiagnosis("");
        setMedicines("");
        setNotes("");
        fetchPractitionerAppointments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue prescription.");
    } finally {
      setIsSubmittingPrescription(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading practitioner schedule...</p>
      </div>
    );
  }

  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const pendingCount = safeAppointments.filter(a => a?.status === "Pending").length;
  const confirmedCount = safeAppointments.filter(a => a?.status === "Confirmed").length;
  const completedCount = safeAppointments.filter(a => a?.status === "Completed").length;

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem", color: "var(--primary-deep)" }}>
          Dr. {user?.name || "Doctor"}'s Workspace
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Specialization: {user?.specialization || "General Medicine"} | Manage patient consultations and prescriptions.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-3" style={{ marginBottom: "2.5rem" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaClock />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{pendingCount}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Pending Requests</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaCalendarCheck />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{confirmedCount}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Confirmed Sessions</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--secondary-light)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaCheck />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{completedCount}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Completed Consultations</div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <h2 style={{ fontSize: "1.3rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>Patient Appointments</h2>

      {safeAppointments.length === 0 ? (
        <div className="card flex-center" style={{ padding: "3rem", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <FaCalendarCheck style={{ fontSize: "3rem", color: "var(--border)" }} />
          <p>No patient appointments found for your account.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {safeAppointments.map((app) => (
            <div key={app._id} className="card" style={{ padding: "1.5rem" }}>
              <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
                
                {/* Patient Details */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem"
                  }}>
                    {app.patient?.name ? app.patient.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--primary-deep)" }}>{app.patient?.name || "Patient"}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                      {app.patient?.email && <span><FaEnvelope /> {app.patient.email}</span>}
                      {app.patient?.phone && <span><FaPhone /> {app.patient.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Appointment Date & Slot */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, color: "var(--primary-deep)", fontSize: "0.95rem" }}>
                    <FaCalendarAlt style={{ marginRight: "0.35rem", color: "var(--primary)" }} />
                    {formatDate(app.appointmentDate)}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    <FaClock style={{ marginRight: "0.25rem" }} /> {app.timeSlot}
                  </div>
                </div>

              </div>

              {/* Visit Reason */}
              {app.reason && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem" }}>
                  <strong>Reason for Visit:</strong> {app.reason}
                </div>
              )}

              {/* Status & Action Buttons */}
              <div className="flex-between" style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  Status: <span className={`badge badge-${app.status ? app.status.toLowerCase() : "pending"}`}>{app.status || "Pending"}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {app.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app._id, "Confirmed")}
                        className="btn btn-secondary"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        <FaCheck /> Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app._id, "Cancelled")}
                        className="btn btn-danger"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}

                  {app.status === "Confirmed" && (
                    <button
                      onClick={() => setSelectedAppointment(app)}
                      className="btn btn-primary"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                    >
                      <FaPrescription /> Issue Prescription
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Issue Modal */}
      {selectedAppointment && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "550px", padding: "2rem" }}>
            <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--primary-deep)" }}>Issue Prescription</h3>
              <button onClick={() => setSelectedAppointment(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)" }}>
                <FaTimes />
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Patient: <strong>{selectedAppointment.patient?.name}</strong> | Date: {formatDate(selectedAppointment.appointmentDate)}
            </p>

            <form onSubmit={handleCreatePrescription}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="diagnosis">Diagnosis</label>
                <input
                  id="diagnosis"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acute Bronchitis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="medicines">Prescribed Medicines (Comma Separated)</label>
                <textarea
                  id="medicines"
                  rows="3"
                  className="form-input"
                  placeholder="e.g. Amoxicillin 500mg (1-0-1), Paracetamol 650mg (as needed)"
                  value={medicines}
                  onChange={(e) => setMedicines(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">Doctor's Advice & Notes</label>
                <input
                  id="notes"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Drink warm water and rest"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPrescription}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {isSubmittingPrescription ? "Submitting..." : "Submit Prescription"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerDashboard;
