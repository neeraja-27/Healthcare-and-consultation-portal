import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const GuestRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }

  // If already authenticated, redirect them based on their role
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (user?.role === "practitioner") {
      return <Navigate to="/practitioner-dashboard" replace />;
    }
    // Default redirect is patient dashboard
    return <Navigate to="/patient-dashboard" replace />;
  }

  // If not authenticated, render the child component (e.g. Login or Register)
  return <Outlet />;
};

export default GuestRoute;
