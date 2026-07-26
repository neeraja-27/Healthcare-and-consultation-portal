import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaUserCheck, FaUserMd, FaCheckCircle, FaTimesCircle, FaGraduationCap, FaStethoscope } from "react-icons/fa";

/* ==========================================================================
   VERIFY PRACTITIONERS COMPONENT
   --------------------------------------------------------------------------
   Dedicated admin verification view for reviewing medical doctor licenses
   and approving unverified accounts.
   ========================================================================== */
const VerifyPractitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      const response = await API.get("/practitioners");
      if (response.data?.success) {
        setPractitioners(response.data.practitioners || []);
      }
    } catch (error) {
      toast.error("Failed to load practitioner list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const handleVerifyToggle = async (id, currentVerifiedState) => {
    try {
      const response = await API.put(`/practitioners/${id}`, {
        isVerified: !currentVerifiedState,
      });

      if (response.data?.success) {
        toast.success(
          `Doctor ${!currentVerifiedState ? "verified and granted platform access." : "verification revoked."}`
        );
        fetchPractitioners();
      }
    } catch (error) {
      toast.error("Failed to update doctor verification status.");
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Retrieving practitioner verification queue...</p>
      </div>
    );
  }

  const unverified = practitioners.filter((p) => !p.isVerified);
  const verified = practitioners.filter((p) => p.isVerified);

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Verify Medical Practitioners</h1>
        <p style={{ color: "var(--text-muted)" }}>Review practitioner qualifications and license approvals.</p>
      </div>

      {/* Pending Verifications */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--warning)" }}>
        Pending Approval Queue ({unverified.length})
      </h2>

      {unverified.length === 0 ? (
        <div className="card" style={{ padding: "1.5rem", color: "var(--text-muted)", marginBottom: "2.5rem" }}>
          <p style={{ margin: 0 }}>No pending practitioner verifications at this time.</p>
        </div>
      ) : (
        <div className="grid-cols-2" style={{ marginBottom: "2.5rem" }}>
          {unverified.map((doc) => (
            <div key={doc._id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="flex-between" style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Dr. {doc.name}</div>
                  <span className="badge badge-pending">Pending Approval</span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.4rem", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "0.75rem 0", marginBottom: "1rem" }}>
                  <div><FaStethoscope /> <strong>Specialization:</strong> {doc.specialization || "General"}</div>
                  <div><FaGraduationCap /> <strong>Qualification:</strong> {doc.qualification || "MBBS"}</div>
                  <div><strong>Experience:</strong> {doc.experience || 0} Years</div>
                  <div><strong>Email:</strong> {doc.email}</div>
                  <div><strong>Fee:</strong> ${doc.consultationFee || 0}</div>
                </div>
              </div>

              <button
                onClick={() => handleVerifyToggle(doc._id, doc.isVerified)}
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <FaCheckCircle /> Verify & Approve License
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Already Verified Practitioners */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--success)" }}>
        Verified Doctors ({verified.length})
      </h2>

      <div className="grid-cols-3">
        {verified.map((doc) => (
          <div key={doc._id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
                <div style={{ fontWeight: 600 }}>Dr. {doc.name}</div>
                <span className="badge badge-approved"><FaCheckCircle /> Verified</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                {doc.specialization} | {doc.qualification}
              </div>
            </div>

            <button
              onClick={() => handleVerifyToggle(doc._id, doc.isVerified)}
              className="btn btn-outline"
              style={{ fontSize: "0.8rem", padding: "0.4rem" }}
            >
              Revoke Approval
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VerifyPractitioners;
