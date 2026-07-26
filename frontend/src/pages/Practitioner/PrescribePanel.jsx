import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaFileMedical, FaPills, FaUser, FaCheck, FaNotesMedical, FaPaperPlane } from "react-icons/fa";

/* ==========================================================================
   PRESCRIBE PANEL COMPONENT
   --------------------------------------------------------------------------
   Dedicated doctor workstation page for issuing digital medical prescriptions.
   ========================================================================== */
const PrescribePanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Active form selection
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConfirmed = async () => {
      try {
        setLoading(true);
        const response = await API.get("/appointments/practitioner");
        if (response.data?.success) {
          const eligible = (response.data.appointments || []).filter(
            (a) => a.status === "Confirmed" || a.status === "Completed"
          );
          setAppointments(eligible);
          if (eligible.length > 0) {
            setSelectedAppointmentId(eligible[0]._id);
          }
        }
      } catch (error) {
        toast.error("Failed to load eligible patient appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmed();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointmentId) {
      toast.error("Please select a patient appointment.");
      return;
    }

    if (!diagnosis || !medicines) {
      toast.error("Diagnosis and medicines are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const medList = medicines.split(",").map((m) => m.trim()).filter(Boolean);
      const response = await API.post("/prescriptions", {
        appointment: selectedAppointmentId,
        diagnosis,
        medicines: medList,
        notes,
      });

      if (response.data?.success) {
        toast.success("Prescription issued successfully!");
        setDiagnosis("");
        setMedicines("");
        setNotes("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Opening prescription workstation...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "750px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Prescribe Panel</h1>
        <p style={{ color: "var(--text-muted)" }}>Write and issue digital medical prescriptions for your patients.</p>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        {appointments.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
            <p>No confirmed appointments available to issue prescriptions for.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {/* Select Patient Appointment */}
            <div className="form-group">
              <label className="form-label" htmlFor="appointmentSelect">
                <FaUser style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                Select Patient Appointment
              </label>
              <select
                id="appointmentSelect"
                className="form-input"
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
              >
                {appointments.map((app) => (
                  <option key={app._id} value={app._id}>
                    Patient: {app.patient?.name} | Reason: {app.reason || "General"} | Status: {app.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosis */}
            <div className="form-group">
              <label className="form-label" htmlFor="diagnosis">
                <FaNotesMedical style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                Diagnosis & Clinical Assessment
              </label>
              <input
                id="diagnosis"
                type="text"
                className="form-input"
                placeholder="e.g. Acute Pharyngitis, Viral Fever"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            {/* Prescribed Medicines */}
            <div className="form-group">
              <label className="form-label" htmlFor="medicines">
                <FaPills style={{ marginRight: "0.5rem", color: "var(--secondary)" }} />
                Prescribed Medicines & Dosage Instructions (Comma Separated)
              </label>
              <textarea
                id="medicines"
                rows="4"
                className="form-input"
                placeholder="e.g. Amoxicillin 500mg (1-0-1 for 5 days), Paracetamol 650mg (as needed for fever), Cetirizine 10mg (0-0-1 at night)"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Doctor's Notes */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="form-label" htmlFor="notes">
                Doctor's Special Notes & Dietary Advice
              </label>
              <input
                id="notes"
                type="text"
                className="form-input"
                placeholder="e.g. Drink plenty of warm water, avoid cold foods, follow up in 5 days if fever persists"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: "100%", height: "45px", justifyContent: "center" }}
            >
              {isSubmitting ? (
                <div className="loader" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div>
              ) : (
                <>
                  <FaPaperPlane /> Issue Digital Prescription
                </>
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default PrescribePanel;
