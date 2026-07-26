import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ==========================================================================
   PROTECTED ROUTE GUARD
   --------------------------------------------------------------------------
   Verifies authentication status and user role case-insensitively before
   rendering outlet components.
   ========================================================================== */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // 1. Show spinner while auth state is initializing
  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Verifying user credentials...</p>
      </div>
    );
  }

  // 2. Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Case-insensitive role check
  const userRole = user?.role ? String(user.role).toLowerCase() : "";
  const permittedRoles = allowedRoles ? allowedRoles.map(r => String(r).toLowerCase()) : [];

  if (permittedRoles.length > 0 && !permittedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 4. Render protected child route
  return <Outlet />;
};

export default ProtectedRoute;
