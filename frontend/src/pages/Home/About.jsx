import { FaShieldAlt, FaUserMd, FaHeartbeat, FaCheckCircle, FaAward } from "react-icons/fa";

/* ==========================================================================
   ABOUT PAGE COMPONENT
   --------------------------------------------------------------------------
   Details the portal mission, medical standards, and infrastructure highlights.
   ========================================================================== */
const About = () => {
  return (
    <div className="container" style={{ padding: "3.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", color: "var(--primary-deep)" }}>About Our Healthcare Network</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "650px", margin: "0.5rem auto 0", fontSize: "1.05rem" }}>
          Empowering patients and medical practitioners with seamless online consultation scheduling, tele-health connections, and digital health records.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid-cols-2" style={{ gap: "2rem", marginBottom: "3.5rem" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
            <FaHeartbeat />
          </div>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem", color: "var(--primary-deep)" }}>Our Mission</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Our mission is to make quality healthcare accessible to everyone, anywhere. By connecting patients directly with verified medical specialists, we eliminate long waiting queues and streamline clinical care.
          </p>
        </div>

        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--secondary-light)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>
            <FaShieldAlt />
          </div>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem", color: "var(--primary-deep)" }}>Security & Compliance</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            We prioritize patient privacy and data security. All clinical consultation notes, medical histories, and digital prescriptions are encrypted and accessible strictly by authorized practitioners and account holders.
          </p>
        </div>
      </div>

      {/* Trust Stats */}
      <div className="card" style={{ padding: "2.5rem", backgroundColor: "var(--primary-light)", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
        <div className="grid-cols-3" style={{ textAlign: "center" }}>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-deep)" }}>100%</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Verified Medical Doctors</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-deep)" }}>24/7</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Online Booking Access</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-deep)" }}>Instant</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>Digital Prescriptions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
