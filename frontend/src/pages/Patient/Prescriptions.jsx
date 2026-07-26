import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaPills,
  FaCalendarAlt,
  FaFilePrescription,
  FaStethoscope,
  FaNotesMedical,
  FaInbox
} from "react-icons/fa";

/* ==========================================================================
   PRESCRIPTIONS COMPONENT
   --------------------------------------------------------------------------
   Renders digital prescriptions issued by practitioners to the logged-in patient.
   ========================================================================== */
const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await API.get("/prescriptions/patient");
        if (response.data?.success) {
          setPrescriptions(response.data.prescriptions || []);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Retrieving digital prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem", color: "var(--primary-deep)" }}>My Prescriptions</h1>
        <p style={{ color: "var(--text-muted)" }}>View digital prescriptions and dosage instructions issued by your doctors.</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="card flex-center" style={{ padding: "4rem 2rem", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <FaInbox style={{ fontSize: "3.5rem", color: "var(--border)" }} />
          <p style={{ fontSize: "1.1rem" }}>You have no prescriptions issued yet.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="card glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Doctor & Date Header */}
              <div className="flex-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "var(--secondary-light)",
                    color: "var(--secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem"
                  }}>
                    <FaFilePrescription />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", margin: 0, color: "var(--primary-deep)" }}>Dr. {pres.practitioner?.name || "Doctor"}</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FaStethoscope /> {pres.practitioner?.specialization || "Medical Specialist"}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", justifyContent: "flex-end" }}>
                    <FaCalendarAlt /> {formatDate(pres.createdAt)}
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-deep)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FaNotesMedical style={{ color: "var(--primary)" }} /> Diagnosis
                </div>
                <div style={{ fontSize: "0.95rem", color: "var(--text-main)", backgroundColor: "var(--bg-app)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)" }}>
                  {pres.diagnosis || "No specific diagnosis listed"}
                </div>
              </div>

              {/* Medicines List */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-deep)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FaPills style={{ color: "var(--secondary)" }} /> Prescribed Medicines
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {Array.isArray(pres.medicines) && pres.medicines.length > 0 ? (
                    pres.medicines.map((med, index) => {
                      const name = typeof med === "string" ? med : (med.medicineName || med.name || "Medicine");
                      const dosage = typeof med === "object" ? med.dosage : "";
                      const frequency = typeof med === "object" ? med.frequency : "";
                      const duration = typeof med === "object" ? med.duration : "";
                      
                      return (
                        <div key={index} style={{
                          padding: "0.6rem 0.85rem",
                          border: "1px dashed var(--border)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.875rem",
                          backgroundColor: "#ffffff"
                        }}>
                          <div style={{ fontWeight: 700, color: "var(--primary-deep)" }}>
                            💊 {name}
                          </div>
                          {(dosage || frequency || duration) && (
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                              {dosage && <span>Dosage: {dosage} • </span>}
                              {frequency && <span>Frequency: {frequency} • </span>}
                              {duration && <span>Duration: {duration}</span>}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>No medicines listed.</div>
                  )}
                </div>
              </div>

              {/* Doctor's Notes */}
              {pres.notes && (
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                  <strong>Doctor's Advice:</strong> {pres.notes}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
