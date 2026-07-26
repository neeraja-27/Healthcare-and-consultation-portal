import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaStethoscope,
  FaGraduationCap,
  FaHistory,
  FaDollarSign,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaCalendarPlus,
  FaArrowLeft
} from "react-icons/fa";

/* ==========================================================================
   PRACTITIONER DETAILS COMPONENT
   --------------------------------------------------------------------------
   Displays comprehensive information for a single doctor based on URL `:id`.
   ========================================================================== */
const PractitionerDetails = () => {
  const { id } = useParams();
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPractitionerDetail = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/practitioners/${id}`);
        if (response.data?.success) {
          setPractitioner(response.data.practitioner);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPractitionerDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading specialist details...</p>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2>Doctor Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>The requested medical practitioner profile does not exist.</p>
        <Link to="/practitioners" className="btn btn-primary">
          <FaArrowLeft /> Back to Specialists
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem", maxWidth: "800px" }}>
      {/* Back button */}
      <Link to="/practitioners" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontWeight: 500 }}>
        <FaArrowLeft /> Back to Doctor List
      </Link>

      <div className="card" style={{ padding: "2.5rem" }}>
        {/* Doctor Header Banner */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "2rem"
          }}>
            {practitioner.name ? practitioner.name.charAt(0).toUpperCase() : "D"}
          </div>

          <div>
            <h2 style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Dr. {practitioner.name}
              {practitioner.isVerified && (
                <FaCheckCircle style={{ color: "var(--secondary)", fontSize: "1.2rem" }} title="Verified Doctor" />
              )}
            </h2>
            <div style={{ fontSize: "1rem", color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem" }}>
              <FaStethoscope /> {practitioner.specialization || "General Physician"}
            </div>
          </div>
        </div>

        {/* Detailed Grid Stats */}
        <div className="grid-cols-2" style={{ marginBottom: "2rem" }}>
          
          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaGraduationCap /> Qualification
            </div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{practitioner.qualification || "MBBS"}</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaHistory /> Clinical Experience
            </div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{practitioner.experience || 0} Years</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaDollarSign /> Consultation Fee
            </div>
            <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--secondary)" }}>${practitioner.consultationFee || 0}</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaPhone /> Phone Contact
            </div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{practitioner.phone || "N/A"}</div>
          </div>

        </div>

        {/* Email */}
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaEnvelope style={{ color: "var(--primary)" }} />
          <span><strong>Email:</strong> {practitioner.email}</span>
        </div>

        {/* Booking Action Button */}
        <div style={{ textAlign: "center" }}>
          <Link
            to={`/book-appointment?doctor=${practitioner._id}`}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", justifyContent: "center" }}
          >
            <FaCalendarPlus /> Book Consultation with Dr. {practitioner.name}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PractitionerDetails;
