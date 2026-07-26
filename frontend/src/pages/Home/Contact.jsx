import { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

/* ==========================================================================
   CONTACT PAGE COMPONENT
   --------------------------------------------------------------------------
   Interactive contact form and customer support directory.
   ========================================================================== */
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been received by our support team.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.25rem", color: "var(--primary-deep)" }}>Contact Support</h1>
        <p style={{ color: "var(--text-muted)" }}>Have questions or need assistance with your booking? Reach out to our team.</p>
      </div>

      <div className="grid-cols-2" style={{ gap: "2rem" }}>
        {/* Support Information */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-deep)" }}>Get in Touch</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FaPhone />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Helpline</div>
                  <div style={{ color: "var(--text-muted)" }}>+1 (800) 555-HEALTH</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--secondary-light)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FaEnvelope />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Email Support</div>
                  <div style={{ color: "var(--text-muted)" }}>support@healthcareportal.com</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Medical Hub HQ</div>
                  <div style={{ color: "var(--text-muted)" }}>100 Health Sciences Plaza, Suite 400</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--primary-deep)" }}>Send Us a Message</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="cName">Your Name</label>
              <input
                id="cName"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cEmail">Email Address</label>
              <input
                id="cEmail"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cSubject">Subject</label>
              <input
                id="cSubject"
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" htmlFor="cMsg">Message</label>
              <textarea
                id="cMsg"
                rows="4"
                className="form-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", height: "45px" }}>
              {isSubmitting ? <div className="loader" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div> : <><FaPaperPlane /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
