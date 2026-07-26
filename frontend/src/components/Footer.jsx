import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FaHeartbeat, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

/* ==========================================================================
   FOOTER COMPONENT (WITH MULTI-LANGUAGE TRANSLATIONS)
   --------------------------------------------------------------------------
   Footer bar translated using useLanguage().
   ========================================================================== */
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: "#0f172a",
      color: "#94a3b8",
      paddingTop: "3.5rem",
      paddingBottom: "1.5rem",
      marginTop: "auto",
      borderTop: "3px solid var(--primary)",
      position: "relative",
      zIndex: 10
    }}>
      <div className="container">
        
        {/* Main Footer Grid */}
        <div className="grid-cols-3" style={{ gap: "2.5rem", marginBottom: "3rem" }}>
          
          {/* Column 1: Brand & Bio */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <FaHeartbeat style={{ color: "var(--primary)", fontSize: "1.75rem" }} />
              <span style={{ fontWeight: 800, fontSize: "1.35rem", color: "#ffffff" }}>
                Health<span style={{ color: "#60a5fa" }}>Portal</span>
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#cbd5e1", marginBottom: "1.25rem" }}>
              {t("footer_bio")}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--success)" }}>
              <FaShieldAlt /> {t("hipaa_certified")}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "1rem" }}>{t("quick_links")}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
              <li>
                <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>{t("home")}</Link>
              </li>
              <li>
                <Link to="/practitioners" style={{ color: "#cbd5e1", textDecoration: "none" }}>{t("practitioners")}</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: "#cbd5e1", textDecoration: "none" }}>{t("services")}</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: "#cbd5e1", textDecoration: "none" }}>{t("about")}</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: "#cbd5e1", textDecoration: "none" }}>{t("contact")}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "1rem" }}>{t("contact_support")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "#cbd5e1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaPhone style={{ color: "#60a5fa" }} />
                <span>+1 (800) 555-HEALTH</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaEnvelope style={{ color: "#60a5fa" }} />
                <span>support@healthcareportal.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaMapMarkerAlt style={{ color: "#60a5fa" }} />
                <span>100 Health Sciences Plaza, Suite 400</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar Copyright */}
        <div style={{
          borderTop: "1px solid #1e293b",
          paddingTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#64748b"
        }}>
          <p>© {new Date().getFullYear()} {t("rights_reserved")}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
