import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  FaHeartbeat,
  FaSignOutAlt,
  FaColumns,
  FaSignInAlt,
  FaGlobe
} from "react-icons/fa";

/* ==========================================================================
   HEADER COMPONENT (WITH MULTI-LANGUAGE SWITCHER)
   --------------------------------------------------------------------------
   Top navigation bar with language selector dropdown (EN, ES, FR, HI, TE).
   ========================================================================== */
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      backgroundColor: "#ffffff",
      borderBottom: "1px solid var(--border)",
      zIndex: 100,
      boxShadow: "0 2px 10px rgba(37, 99, 235, 0.08)"
    }}>
      <div className="container flex-between" style={{ height: "75px" }}>
        
        {/* Brand Logo & Name */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            <FaHeartbeat />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--primary-deep)", letterSpacing: "-0.5px" }}>
              Health<span style={{ color: "var(--primary)" }}>Portal</span>
            </span>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Virtual Tele-Healthcare
            </div>
          </div>
        </Link>

        {/* Center Navigation Links (Translated) */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {[
            { path: "/", label: t("home") },
            { path: "/practitioners", label: t("practitioners") },
            { path: "/services", label: t("services") },
            { path: "/about", label: t("about") },
            { path: "/contact", label: t("contact") },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `public-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Language Selector + Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          
          {/* Language Selection Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", backgroundColor: "var(--primary-light)", padding: "0.35rem 0.6rem", borderRadius: "8px", border: "1px solid rgba(37, 99, 235, 0.2)" }}>
            <FaGlobe style={{ color: "var(--primary)", fontSize: "0.95rem" }} />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--primary-deep)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                outline: "none"
              }}
              title="Select Language / भाषा चुनें"
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="hi">🇮🇳 हिंदी (Hindi)</option>
              <option value="te">🇮🇳 తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Auth Action Buttons */}
          {isAuthenticated ? (
            <>
              <Link
                to={
                  user?.role === "admin" ? "/admin-dashboard" :
                  user?.role === "practitioner" ? "/practitioner-dashboard" : "/patient-dashboard"
                }
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.4rem" }}
              >
                <FaColumns /> {t("dashboard")}
              </Link>
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem", color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                title={t("logout")}
              >
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                <FaSignInAlt /> {t("login")}
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

      </div>

      <style>{`
        .public-nav-link {
          padding: 0.5rem 0.85rem;
          color: var(--text-main);
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
          border-radius: 8px;
          transition: var(--transition);
        }
        .public-nav-link:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }
        .public-nav-link.active {
          color: var(--primary);
          background-color: var(--primary-light);
          font-weight: 700;
        }
      `}</style>
    </header>
  );
};

export default Header;
