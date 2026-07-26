import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaUserTag,
  FaStethoscope,
  FaGraduationCap,
  FaHistory,
  FaDollarSign,
  FaSave
} from "react-icons/fa";

/* ==========================================================================
   PROFILE COMPONENT
   --------------------------------------------------------------------------
   Displays authenticated user information and allows practitioners/patients
   to manage account profile attributes.
   ========================================================================== */
const Profile = () => {
  const { user, setUser } = useAuth();
  
  const [specialization, setSpecialization] = useState(user?.specialization || "");
  const [experience, setExperience] = useState(user?.experience || 0);
  const [qualification, setQualification] = useState(user?.qualification || "");
  const [consultationFee, setConsultationFee] = useState(user?.consultationFee || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (user?.role !== "practitioner") return;

    setIsSubmitting(true);
    try {
      const response = await API.put(`/practitioners/${user._id || user.id}`, {
        specialization,
        experience: Number(experience),
        qualification,
        consultationFee: Number(consultationFee),
      });

      if (response.data?.success) {
        toast.success("Profile updated successfully!");
        const updatedUser = { ...user, ...response.data.practitioner };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "750px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>My Profile Settings</h1>
        <p style={{ color: "var(--text-muted)" }}>View and update your personal user account profile details.</p>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        
        {/* User Avatar Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", paddingBottom: "2rem", marginBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "2rem"
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{user?.name}</h2>
            <div style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", textTransform: "capitalize", marginTop: "0.25rem" }}>
              {user?.role} Account
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{user?.email}</div>
          </div>
        </div>

        {/* Readonly Basic Details */}
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>Account Details</h3>
        
        <div className="grid-cols-2" style={{ marginBottom: "2rem" }}>
          
          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaUser /> Full Name
            </div>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaEnvelope /> Email Address
            </div>
            <div style={{ fontWeight: 600 }}>{user?.email}</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaPhone /> Phone Number
            </div>
            <div style={{ fontWeight: 600 }}>{user?.phone || "N/A"}</div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-md)" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaVenusMars /> Gender
            </div>
            <div style={{ fontWeight: 600 }}>{user?.gender || "N/A"}</div>
          </div>

        </div>

        {/* Editable Practitioner Professional Details */}
        {user?.role === "practitioner" && (
          <form onSubmit={handleProfileUpdate}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>
              Practitioner Settings
            </h3>

            <div className="grid-cols-2" style={{ marginBottom: "1.5rem" }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="spec">
                  <FaStethoscope style={{ marginRight: "0.35rem", color: "var(--primary)" }} />
                  Specialization
                </label>
                <input
                  id="spec"
                  type="text"
                  className="form-input"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="exp">
                  <FaHistory style={{ marginRight: "0.35rem", color: "var(--primary)" }} />
                  Experience (Years)
                </label>
                <input
                  id="exp"
                  type="number"
                  min="0"
                  className="form-input"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="qual">
                  <FaGraduationCap style={{ marginRight: "0.35rem", color: "var(--primary)" }} />
                  Qualification
                </label>
                <input
                  id="qual"
                  type="text"
                  className="form-input"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fee">
                  <FaDollarSign style={{ marginRight: "0.35rem", color: "var(--primary)" }} />
                  Consultation Fee ($)
                </label>
                <input
                  id="fee"
                  type="number"
                  min="0"
                  className="form-input"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: "100%", height: "45px", justifyContent: "center" }}
            >
              {isSubmitting ? <div className="loader" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div> : <><FaSave /> Save Profile Changes</>}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default Profile;
