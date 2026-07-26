import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaFileMedical,
  FaVial,
  FaRulerVertical,
  FaWeight,
  FaAllergies,
  FaNotesMedical,
  FaSyringe,
  FaPills,
  FaPhoneAlt,
  FaSave
} from "react-icons/fa";

/* ==========================================================================
   MEDICAL HISTORY COMPONENT
   --------------------------------------------------------------------------
   Allows patients to view, create, or update their clinical health record
   (blood group, height, weight, allergies, chronic conditions, surgeries,
   medications, and emergency contact details).
   ========================================================================== */
const MedicalHistory = () => {
  const [historyExists, setHistoryExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bloodGroup: "A+",
      height: "",
      weight: "",
      allergies: "",
      chronicDiseases: "",
      surgeries: "",
      medications: "",
      emergencyContact: "",
    },
  });

  // Fetch patient medical history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await API.get("/medical-history/my");
        if (response.data?.success && response.data.medicalHistory) {
          const mh = response.data.medicalHistory;
          setHistoryExists(true);
          reset({
            bloodGroup: mh.bloodGroup || "A+",
            height: mh.height || "",
            weight: mh.weight || "",
            allergies: mh.allergies || "",
            chronicDiseases: mh.chronicDiseases || "",
            surgeries: mh.surgeries || "",
            medications: mh.medications || "",
            emergencyContact: mh.emergencyContact || "",
          });
        }
      } catch (error) {
        // If 404, history doesn't exist yet, which is expected for new patients
        if (error.response?.status !== 404) {
          toast.error("Failed to load medical history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [reset]);

  // Form submit handler (POST if new, PUT if updating)
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response;
      if (historyExists) {
        // Update existing record
        response = await API.put("/medical-history", data);
      } else {
        // Create new record
        response = await API.post("/medical-history", data);
      }

      if (response.data?.success) {
        toast.success(response.data.message || "Medical history saved successfully!");
        setHistoryExists(true);
      } else {
        toast.error(response.data?.message || "Failed to save medical history.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving medical history.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading health records...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>My Medical History</h1>
        <p style={{ color: "var(--text-muted)" }}>
          {historyExists
            ? "View and update your personal clinical profile and health metrics."
            : "Create your health profile to share vital details with your consulting practitioners."}
        </p>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Section 1: Vital Stats */}
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>
            <FaVial style={{ marginRight: "0.5rem" }} /> Basic Vitals & Metrics
          </h3>
          
          <div className="grid-cols-3" style={{ marginBottom: "1.5rem" }}>
            
            {/* Blood Group */}
            <div className="form-group">
              <label className="form-label" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select id="bloodGroup" className="form-input" {...register("bloodGroup")}>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Height */}
            <div className="form-group">
              <label className="form-label" htmlFor="height">
                <FaRulerVertical style={{ marginRight: "0.25rem", color: "var(--text-muted)" }} />
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 175"
                {...register("height")}
              />
            </div>

            {/* Weight */}
            <div className="form-group">
              <label className="form-label" htmlFor="weight">
                <FaWeight style={{ marginRight: "0.25rem", color: "var(--text-muted)" }} />
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 70"
                {...register("weight")}
              />
            </div>

          </div>

          {/* Section 2: Clinical Details */}
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>
            <FaNotesMedical style={{ marginRight: "0.5rem" }} /> Clinical Details
          </h3>

          <div className="grid-cols-2" style={{ marginBottom: "1.5rem" }}>
            
            {/* Allergies */}
            <div className="form-group">
              <label className="form-label" htmlFor="allergies">
                <FaAllergies style={{ marginRight: "0.25rem", color: "var(--danger)" }} />
                Known Allergies
              </label>
              <input
                id="allergies"
                type="text"
                className="form-input"
                placeholder="e.g. Penicillin, Peanuts, Dust"
                {...register("allergies")}
              />
            </div>

            {/* Chronic Diseases */}
            <div className="form-group">
              <label className="form-label" htmlFor="chronicDiseases">
                <FaNotesMedical style={{ marginRight: "0.25rem", color: "var(--warning)" }} />
                Chronic Conditions
              </label>
              <input
                id="chronicDiseases"
                type="text"
                className="form-input"
                placeholder="e.g. Asthma, Diabetes, Hypertension"
                {...register("chronicDiseases")}
              />
            </div>

            {/* Past Surgeries */}
            <div className="form-group">
              <label className="form-label" htmlFor="surgeries">
                <FaSyringe style={{ marginRight: "0.25rem", color: "var(--primary)" }} />
                Past Surgeries / Operations
              </label>
              <input
                id="surgeries"
                type="text"
                className="form-input"
                placeholder="e.g. Appendectomy (2020)"
                {...register("surgeries")}
              />
            </div>

            {/* Current Medications */}
            <div className="form-group">
              <label className="form-label" htmlFor="medications">
                <FaPills style={{ marginRight: "0.25rem", color: "var(--secondary)" }} />
                Current Medications
              </label>
              <input
                id="medications"
                type="text"
                className="form-input"
                placeholder="e.g. Insulin, Metformin 500mg"
                {...register("medications")}
              />
            </div>

          </div>

          {/* Section 3: Emergency Contact */}
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>
            <FaPhoneAlt style={{ marginRight: "0.5rem" }} /> Emergency Contact
          </h3>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="emergencyContact">
              Emergency Contact Person & Phone Number
            </label>
            <input
              id="emergencyContact"
              type="text"
              className="form-input"
              placeholder="e.g. Mary Jane (Spouse) - +1987654321"
              {...register("emergencyContact")}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", height: "45px", justifyContent: "center" }}
          >
            {isSubmitting ? (
              <div className="loader" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div>
            ) : (
              <>
                <FaSave /> {historyExists ? "Update Medical Record" : "Save Medical Record"}
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default MedicalHistory;
