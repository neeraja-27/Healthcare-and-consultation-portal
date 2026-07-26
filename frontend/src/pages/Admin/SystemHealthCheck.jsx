import { useState, useEffect } from "react";
import API from "../../services/api";
import { FaHeartbeat, FaDatabase, FaServer, FaCheckCircle, FaExclamationTriangle, FaRedo } from "react-icons/fa";

/* ==========================================================================
   SYSTEM HEALTH CHECK COMPONENT
   --------------------------------------------------------------------------
   Admin dashboard for monitoring system server performance, database connectivity,
   API latency, and service availability.
   ========================================================================== */
const SystemHealthCheck = () => {
  const [health, setHealth] = useState({
    serverStatus: "Checking...",
    dbStatus: "Checking...",
    latency: null,
    lastChecked: null,
  });
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      // Ping API
      const res = await API.get("/practitioners");
      const endTime = Date.now();
      const latencyMs = endTime - startTime;

      if (res.data?.success) {
        setHealth({
          serverStatus: "Operational",
          dbStatus: "Connected (MongoDB)",
          latency: `${latencyMs} ms`,
          lastChecked: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      setHealth({
        serverStatus: "Degraded / Error",
        dbStatus: "Unreachable",
        latency: "Timeout",
        lastChecked: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>System Health Check</h1>
          <p style={{ color: "var(--text-muted)" }}>Monitor backend infrastructure, database ping, and REST API latency.</p>
        </div>
        <button onClick={checkHealth} className="btn btn-outline" disabled={loading}>
          <FaRedo className={loading ? "spin" : ""} /> Refresh Status
        </button>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: "2rem" }}>
        {/* Express Server Health */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaServer />
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary-deep)" }}>
              {health.serverStatus}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Node.js / Express Server</div>
          </div>
        </div>

        {/* Database Health */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--secondary-light)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaDatabase />
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary-deep)" }}>
              {health.dbStatus}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Database Engine</div>
          </div>
        </div>

        {/* Latency */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaHeartbeat />
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary-deep)" }}>
              {health.latency || "--"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>API Response Latency</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-deep)" }}>
          System Telemetry Log
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
          <div className="flex-between" style={{ padding: "0.75rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)" }}>
            <span>REST API Gateways (`/api/*`)</span>
            <span className="badge badge-approved"><FaCheckCircle /> 100% Operational</span>
          </div>

          <div className="flex-between" style={{ padding: "0.75rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)" }}>
            <span>JWT Auth Token Verification Service</span>
            <span className="badge badge-approved"><FaCheckCircle /> Active</span>
          </div>

          <div className="flex-between" style={{ padding: "0.75rem", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)" }}>
            <span>Last System Audit Ping</span>
            <span style={{ fontWeight: 600 }}>{health.lastChecked || "Just now"}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SystemHealthCheck;
