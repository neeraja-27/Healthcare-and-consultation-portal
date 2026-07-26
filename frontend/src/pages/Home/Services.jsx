import { Link } from "react-router-dom";
import { FaStethoscope, FaHeartbeat, FaBrain, FaBaby, FaTooth, FaEye, FaNotesMedical, FaPills, FaArrowRight } from "react-icons/fa";

/* ==========================================================================
   SERVICES / SPECIALTIES PAGE COMPONENT
   --------------------------------------------------------------------------
   Presents all clinical services offered by the healthcare portal network.
   ========================================================================== */
const Services = () => {
  const serviceList = [
    { title: "General Medicine", icon: <FaStethoscope />, desc: "Primary health consultations, routine checkups, wellness screenings, and preventive care.", count: "60+ Doctors" },
    { title: "Cardiology", icon: <FaHeartbeat />, desc: "Advanced cardiovascular diagnostics, ECG, heart disease treatment, and blood pressure management.", count: "45+ Doctors" },
    { title: "Neurology", icon: <FaBrain />, desc: "Comprehensive brain, spine, migraine, and neurological disorder consultations.", count: "28+ Doctors" },
    { title: "Pediatrics", icon: <FaBaby />, desc: "Specialized healthcare, immunization, and growth tracking for infants and children.", count: "40+ Doctors" },
    { title: "Orthopedics", icon: <FaNotesMedical />, desc: "Bone health, joint replacement, fracture care, and physical therapy consultations.", count: "38+ Doctors" },
    { title: "Dermatology", icon: <FaPills />, desc: "Skin care, acne treatment, laser therapies, and cosmetic dermatology.", count: "32+ Doctors" },
    { title: "Dental Care", icon: <FaTooth />, desc: "Oral hygiene, root canal treatments, teeth whitening, and orthodontics.", count: "25+ Doctors" },
    { title: "Ophthalmology", icon: <FaEye />, desc: "Vision testing, eye disease treatments, and optical prescriptions.", count: "20+ Doctors" },
  ];

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.25rem", color: "var(--primary-deep)" }}>Our Medical Services & Specialties</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          We provide specialized healthcare consultation across all clinical fields with certified medical experts.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid-cols-3" style={{ marginBottom: "3rem" }}>
        {serviceList.map((service, index) => (
          <div key={index} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{
                width: "55px",
                height: "55px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem"
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{service.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                {service.desc}
              </p>
            </div>

            <div className="flex-between" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                {service.count}
              </span>
              <Link to="/practitioners" className="btn btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                Find Doctors <FaArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
