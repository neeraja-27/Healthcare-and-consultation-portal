import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaStethoscope,
  FaGraduationCap,
  FaHistory,
  FaDollarSign,
  FaSearch,
  FaCheckCircle,
  FaCalendarPlus,
  FaPlus,
  FaTimes,
  FaUserPlus
} from "react-icons/fa";

/* ==========================================================================
   PRACTITIONER LIST COMPONENT (DOCTOR FINDER & SPECIALIST DIRECTORY)
   --------------------------------------------------------------------------
   Displays all medical specialists, provides specialty filter pills, and
   includes a modal for adding new doctors to the platform.
   ========================================================================== */
const PractitionerList = () => {
  const { isAuthenticated, user } = useAuth();
  const [practitioners, setPractitioners] = useState([]);
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Modal State for Adding New Doctor
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    specialization: "Cardiology",
    qualification: "MBBS, MD",
    experience: 5,
    consultationFee: 100
  });

  // Fetch list of practitioners from backend API
  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      const response = await API.get("/practitioners");
      if (response.data?.success) {
        setPractitioners(response.data.practitioners || []);
        setFilteredPractitioners(response.data.practitioners || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load practitioners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractitioners();
  }, []);

  // Extract unique list of specializations for filter tabs
  const specialties = [
    "All",
    ...Array.from(
      new Set(
        practitioners
          .map((p) => p.specialization)
          .filter((spec) => spec && spec.trim() !== "")
      )
    ),
  ];

  // Handle Search and Filter logic
  useEffect(() => {
    let result = practitioners;

    // Specialty filter
    if (selectedSpecialty !== "All") {
      result = result.filter(
        (p) => p.specialization?.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    // Text search filter (Name or Qualification or Specialty)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.specialization?.toLowerCase().includes(term) ||
          p.qualification?.toLowerCase().includes(term)
      );
    }

    setFilteredPractitioners(result);
  }, [searchTerm, selectedSpecialty, practitioners]);

  // Submit Handler for Adding a New Doctor
  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.email) {
      toast.error("Please fill in Doctor Name and Email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await API.post("/practitioners", newDoctor);
      if (response.data?.success) {
        toast.success(`Dr. ${newDoctor.name} added successfully!`);
        setShowAddModal(false);
        setNewDoctor({
          name: "",
          email: "",
          phone: "",
          gender: "Male",
          specialization: "Cardiology",
          qualification: "MBBS, MD",
          experience: 5,
          consultationFee: 100
        });
        fetchPractitioners(); // Refresh doctor list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Finding top healthcare specialists...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.25rem", color: "var(--primary-deep)" }}>Find a Healthcare Specialist</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Browse verified doctors across all specialties, check qualifications, and schedule appointments online.
          </p>
        </div>

        {/* Add Doctor Button for Logged-In Users */}
        {isAuthenticated && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ padding: "0.75rem 1.25rem" }}
          >
            <FaUserPlus /> Add New Doctor
          </button>
        )}
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
        <div className="flex-between" style={{ gap: "1rem", flexWrap: "wrap" }}>
          
          {/* Search Input Box */}
          <div style={{ flex: "1 1 300px", position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.75rem" }}
              placeholder="Search by doctor name, specialty, or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Specialty Dropdown */}
          <div style={{ flex: "0 1 220px" }}>
            <select
              className="form-input"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="All">All Specialties ({practitioners.length})</option>
              {specialties.filter(s => s !== "All").map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Specialty Pill Filters */}
        {specialties.length > 1 && (
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`btn ${selectedSpecialty === spec ? "btn-primary" : "btn-outline"}`}
                style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem", borderRadius: "20px", whiteSpace: "nowrap" }}
              >
                {spec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {filteredPractitioners.length === 0 ? (
        <div className="card flex-center" style={{ padding: "4rem 2rem", flexDirection: "column", gap: "1rem", color: "var(--text-muted)" }}>
          <FaUserMd style={{ fontSize: "3.5rem", color: "var(--border)" }} />
          <p style={{ fontSize: "1.1rem" }}>No practitioners found matching your criteria.</p>
          <button onClick={() => { setSearchTerm(""); setSelectedSpecialty("All"); }} className="btn btn-outline">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredPractitioners.map((doc) => (
            <div key={doc._id} className="card glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* Doctor Avatar Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.35rem",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {doc.name ? doc.name.charAt(0).toUpperCase() : "D"}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", margin: 0, display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--primary-deep)" }}>
                      Dr. {doc.name}
                      {doc.isVerified && (
                        <FaCheckCircle style={{ color: "var(--secondary)", fontSize: "0.95rem" }} title="Verified Medical Specialist" />
                      )}
                    </h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FaStethoscope /> {doc.specialization || "General Physician"}
                    </span>
                  </div>
                </div>

                {/* Clinical Info List */}
                <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "0.85rem 0", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaGraduationCap style={{ color: "var(--primary)" }} />
                    <span><strong>Degree:</strong> {doc.qualification || "MBBS"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaHistory style={{ color: "var(--warning)" }} />
                    <span><strong>Experience:</strong> {doc.experience || 0} Years</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaDollarSign style={{ color: "var(--secondary)" }} />
                    <span><strong>Consultation Fee:</strong> ${doc.consultationFee || 0}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  to={`/practitioners/${doc._id}`}
                  className="btn btn-outline"
                  style={{ flex: 1, fontSize: "0.85rem", padding: "0.5rem", justifyContent: "center" }}
                >
                  View Profile
                </Link>
                <Link
                  to={`/book-appointment?doctor=${doc._id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: "0.85rem", padding: "0.5rem", justifyContent: "center" }}
                >
                  <FaCalendarPlus /> Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================================================
         MODAL: ADD NEW DOCTOR
         ========================================================================== */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "550px", backgroundColor: "#ffffff", padding: "2rem", borderRadius: "var(--radius-md)" }}>
            <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", color: "var(--primary-deep)" }}>Add New Medical Specialist</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Doctor Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. John Smith"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. doctor@hospital.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select
                    className="form-input"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Dentistry">Dentistry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. MBBS, MD, MS"
                    value={newDoctor.qualification}
                    onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {isSubmitting ? "Saving..." : "Add Practitioner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PractitionerList;
