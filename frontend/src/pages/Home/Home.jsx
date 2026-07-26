import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  FaUserMd,
  FaCalendarCheck,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaHeartbeat,
  FaStethoscope,
  FaNotesMedical,
  FaHospitalUser
} from "react-icons/fa";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  const specialties = [
    { title: t("cardiology"), desc: t("cardiology_desc"), icon: <FaHeartbeat style={{ color: "#ef4444" }} />, count: "45 Doctors" },
    { title: t("general_medicine"), desc: t("general_medicine_desc"), icon: <FaStethoscope style={{ color: "var(--primary)" }} />, count: "60 Doctors" },
    { title: t("neurology"), desc: t("neurology_desc"), icon: <FaNotesMedical style={{ color: "#8b5cf6" }} />, count: "28 Doctors" },
    { title: t("orthopedics"), desc: t("orthopedics_desc"), icon: <FaHospitalUser style={{ color: "var(--secondary)" }} />, count: "38 Doctors" },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{ padding: "4.5rem 0 3.5rem", position: "relative" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          
          {/* Left Text Column */}
          <div>
            <div className="badge badge-approved" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", marginBottom: "1.25rem", gap: "0.5rem", display: "inline-flex" }}>
              <FaShieldAlt style={{ color: "var(--success)" }} /> {t("verified_network")}
            </div>
            
            <h1 style={{ fontSize: "2.85rem", lineHeight: 1.2, color: "var(--primary-deep)", fontWeight: 800, marginBottom: "1.25rem" }}>
              {t("hero_title")}
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "600px" }}>
              {t("hero_subtitle")}
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {isAuthenticated ? (
                <Link to={
                  user?.role === "admin" ? "/admin-dashboard" :
                  user?.role === "practitioner" ? "/practitioner-dashboard" : "/patient-dashboard"
                } className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                  {t("go_to_dashboard")} <FaArrowRight />
                </Link>
              ) : (
                <>
                  <Link to="/practitioners" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                    {t("find_doctor")} <FaArrowRight />
                  </Link>
                  <Link to="/register" className="btn btn-outline" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
                    {t("create_account")}
                  </Link>
                </>
              )}
            </div>

            {/* Quick stats trust indicators */}
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "2.5rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--primary-deep)" }}>500+</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t("stat_doctors")}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--primary-deep)" }}>99.8%</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t("stat_satisfaction")}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--primary-deep)" }}>24/7</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t("stat_care")}</div>
              </div>
            </div>

          </div>

          {/* Right Highlight Doctor Glassmorphism Card */}
          <div className="glass-card" style={{ padding: "2.5rem", position: "relative" }}>
            
            {/* Animated Heartbeat Pulse Badge */}
            <div style={{
              position: "absolute",
              top: "-15px",
              right: "20px",
              backgroundColor: "var(--secondary)",
              color: "#ffffff",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
              animation: "pulseWave 2s infinite ease-in-out"
            }}>
              <FaHeartbeat /> {t("live_availability")}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                boxShadow: "var(--shadow-sm)"
              }}>
                <FaUserMd />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--primary-deep)" }}>Dr. Sarah Jenkins</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>{t("senior_cardiologist")} • 12 Yrs Exp</span>
              </div>
            </div>

            <div style={{ padding: "1rem", backgroundColor: "var(--primary-light)", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", color: "var(--success)", fontWeight: 600 }}>
                <FaCheckCircle /> {t("slot_available")}
              </div>
              <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{t("slot_time")}</div>
            </div>

            <Link to="/practitioners" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem" }}>
              <FaCalendarCheck /> {t("book_consultation")}
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Key Specialty Departments */}
      <section style={{ padding: "3.5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", color: "var(--primary-deep)" }}>{t("explore_specialties")}</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "550px", margin: "0.5rem auto 0" }}>
              {t("specialties_desc")}
            </p>
          </div>

          <div className="grid-cols-2">
            {specialties.map((spec, index) => (
              <div key={index} className="glass-card" style={{ padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  flexShrink: 0
                }}>
                  {spec.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.35rem", color: "var(--primary-deep)" }}>{spec.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.85rem" }}>{spec.desc}</p>
                  <div className="flex-between" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--primary)" }}>
                    <span>{spec.count}</span>
                    <Link to="/practitioners" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      {t("find_doctor")} <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
