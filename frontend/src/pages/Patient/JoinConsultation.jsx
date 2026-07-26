import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaPaperPlane,
  FaUserMd,
  FaUser,
  FaNotesMedical,
  FaClock,
  FaArrowLeft
} from "react-icons/fa";

/* ==========================================================================
   JOIN CONSULTATION COMPONENT (TELEMEDICINE ROOM)
   --------------------------------------------------------------------------
   Simulated real-time virtual consultation room for patients & doctors.
   Includes video/audio toggles, live chat messages, and consultation controls.
   ========================================================================== */
const JoinConsultation = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Controls state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  // Live Chat state
  const [messages, setMessages] = useState([
    { sender: "System", text: "Encrypted healthcare tele-consultation channel active.", time: "Just now" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch appointment details if ID is provided
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch appointments to match ID
        const endpoint = user?.role === "practitioner" ? "/appointments/practitioner" : "/appointments/my";
        const response = await API.get(endpoint);
        if (response.data?.success) {
          const matched = response.data.appointments.find(a => a._id === appointmentId);
          setAppointment(matched || null);
        }
      } catch (error) {
        toast.error("Failed to load consultation session.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { sender: user?.name || "Me", text: newMessage, time }
    ]);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Connecting to secure medical room...</p>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="container flex-center" style={{ minHeight: "70vh", flexDirection: "column", gap: "1.5rem", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--danger-light)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
          <FaPhoneSlash />
        </div>
        <h2>Consultation Session Concluded</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "500px" }}>
          Your virtual consultation session has ended. A summary has been logged to your portal.
        </p>
        <Link to={user?.role === "practitioner" ? "/practitioner-dashboard" : "/patient-dashboard"} className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      
      {/* Header Bar */}
      <div className="flex-between" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Link to={user?.role === "practitioner" ? "/practitioner-dashboard" : "/my-appointments"} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
            <FaArrowLeft /> Exit Room
          </Link>
          <h2 style={{ fontSize: "1.5rem", margin: 0, color: "var(--primary-deep)" }}>
            Tele-Consultation Room
          </h2>
        </div>

        <div className="badge badge-approved" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.5rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--success)" }}></span>
          Encrypted Connection Active
        </div>
      </div>

      {/* Main Grid: Video Screen + Live Chat */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", ...((window.innerWidth >= 992) && { gridTemplateColumns: "2fr 1fr" }) }}>
        
        {/* Left Side: Video Viewport Container */}
        <div className="card" style={{ padding: "1.5rem", backgroundColor: "#0f172a", color: "#ffffff", minHeight: "450px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          
          {/* Top Info Overlay */}
          <div className="flex-between" style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              <FaUserMd style={{ color: "var(--primary)" }} />
              <span>
                Consultant: <strong>Dr. {appointment?.practitioner?.name || "Medical Specialist"}</strong>
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FaClock /> 14:28
            </div>
          </div>

          {/* Center Main Video Feed (Simulated) */}
          <div className="flex-center" style={{ flexGrow: 1, padding: "3rem 1rem", flexDirection: "column", gap: "1rem" }}>
            {isVideoOn ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "110px", height: "110px", borderRadius: "50%", backgroundColor: "#1e293b", border: "3px solid var(--primary)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#94a3b8" }}>
                  {user?.role === "practitioner" ? <FaUser /> : <FaUserMd />}
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                  Live HD Video Stream Connected
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <FaVideoSlash style={{ fontSize: "3.5rem", marginBottom: "0.75rem", color: "var(--danger)" }} />
                <p>Camera Off</p>
              </div>
            )}
          </div>

          {/* Control Bar Controls at Bottom */}
          <div className="flex-center" style={{ gap: "1.25rem", padding: "1rem", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "var(--radius-md)" }}>
            
            {/* Audio Toggle */}
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: isAudioOn ? "#334155" : "var(--danger)",
                color: "#ffffff",
                fontSize: "1.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isAudioOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: isVideoOn ? "#334155" : "var(--danger)",
                color: "#ffffff",
                fontSize: "1.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
            </button>

            {/* End Call Button */}
            <button
              onClick={() => setCallEnded(true)}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--danger)",
                color: "#ffffff",
                fontSize: "1.4rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title="End Consultation"
            >
              <FaPhoneSlash />
            </button>

          </div>

        </div>

        {/* Right Side: Consultation Live Chat Panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: "520px", padding: 0 }}>
          
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", fontWeight: 600, color: "var(--primary-deep)" }}>
            Clinical Chat Log
          </div>

          {/* Chat Messages Window */}
          <div style={{ flexGrow: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "var(--bg-app)" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === (user?.name || "Me") ? "flex-end" : "flex-start",
                maxWidth: "85%",
                backgroundColor: msg.sender === (user?.name || "Me") ? "var(--primary)" : "#ffffff",
                color: msg.sender === (user?.name || "Me") ? "#ffffff" : "var(--text-main)",
                padding: "0.6rem 0.85rem",
                borderRadius: "12px",
                boxShadow: "var(--shadow-sm)",
                fontSize: "0.85rem"
              }}>
                <div style={{ fontWeight: 600, fontSize: "0.75rem", opacity: 0.8, marginBottom: "0.2rem" }}>
                  {msg.sender} • {msg.time}
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} style={{ padding: "0.85rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              className="form-input"
              style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem" }}
              placeholder="Type message to doctor..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 0.85rem" }}>
              <FaPaperPlane />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default JoinConsultation;
