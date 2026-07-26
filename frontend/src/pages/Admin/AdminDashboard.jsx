import { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaUserShield,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaCheck,
  FaGraduationCap,
  FaStethoscope,
  FaSearch
} from "react-icons/fa";

/* ==========================================================================
   ADMIN DASHBOARD COMPONENT
   --------------------------------------------------------------------------
   Provides system oversight. Admins can view all practitioners, approve/verify
   medical qualifications, and remove accounts if necessary.
   ========================================================================== */
const AdminDashboard = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllPractitioners = async () => {
    try {
      setLoading(true);
      const response = await API.get("/practitioners");
      if (response.data?.success) {
        setPractitioners(response.data.practitioners || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load practitioners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPractitioners();
  }, []);

  // Toggle Doctor Verification
  const handleVerifyPractitioner = async (id, currentVerifiedState) => {
    try {
      const response = await API.put(`/practitioners/${id}`, {
        isVerified: !currentVerifiedState,
      });

      if (response.data?.success) {
        toast.success(
          `Practitioner ${!currentVerifiedState ? "verified and approved!" : "verification revoked."}`
        );
        fetchAllPractitioners();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update verification status.");
    }
  };

  // Delete Practitioner
  const handleDeletePractitioner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this practitioner account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await API.delete(`/practitioners/${id}`);
      if (response.data?.success) {
        toast.success("Practitioner account deleted successfully.");
        fetchAllPractitioners();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete practitioner.");
    }
  };

  const filteredPractitioners = practitioners.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = practitioners.filter((p) => p.isVerified).length;
  const pendingCount = practitioners.length - verifiedCount;

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading administration panel...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Admin Dashboard</h1>
        <p style={{ color: "var(--text-muted)" }}>System administration, practitioner verifications, and user management.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid-cols-3" style={{ marginBottom: "2.5rem" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaUserMd />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{practitioners.length}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Practitioners</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--secondary-light)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{verifiedCount}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Verified Doctors</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "var(--radius-md)", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            <FaTimesCircle />
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-deep)" }}>{pendingCount}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Pending Verification</div>
          </div>
        </div>
      </div>

      {/* Practitioner Verification Management */}
      <div className="card" style={{ padding: "1.75rem" }}>
        <div className="flex-between" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Practitioner Management</h2>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <FaSearch style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.5rem", fontSize: "0.85rem" }}
              placeholder="Search practitioner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPractitioners.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
            No practitioners found matching search query.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--primary-deep)" }}>
                  <th style={{ padding: "0.75rem" }}>Doctor Name</th>
                  <th style={{ padding: "0.75rem" }}>Specialty & Qualification</th>
                  <th style={{ padding: "0.75rem" }}>Fee</th>
                  <th style={{ padding: "0.75rem" }}>Verification Status</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPractitioners.map((doc) => (
                  <tr key={doc._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--primary-deep)" }}>Dr. {doc.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{doc.email} | {doc.phone}</div>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <div><FaStethoscope style={{ color: "var(--primary)", marginRight: "0.25rem" }} /> {doc.specialization || "General"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}><FaGraduationCap /> {doc.qualification || "MBBS"} ({doc.experience || 0} Yrs)</div>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600 }}>
                      ${doc.consultationFee || 0}
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      {doc.isVerified ? (
                        <span className="badge badge-approved" style={{ gap: "0.25rem" }}>
                          <FaCheckCircle /> Verified
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ gap: "0.25rem" }}>
                          <FaTimesCircle /> Unverified
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleVerifyPractitioner(doc._id, doc.isVerified)}
                          className={`btn ${doc.isVerified ? "btn-outline" : "btn-secondary"}`}
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                        >
                          {doc.isVerified ? "Revoke" : "Verify / Approve"}
                        </button>
                        <button
                          onClick={() => handleDeletePractitioner(doc._id)}
                          className="btn btn-danger"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                          title="Delete Account"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
