import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext();

/* ==========================================================================
   AUTH PROVIDER COMPONENT
   --------------------------------------------------------------------------
   Provides global authentication state, role helpers, and login/register/logout methods.
   ========================================================================== */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login status check on application mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          const response = await API.get("/auth/profile");
          if (response.data?.success) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { success, token: receivedToken, user: receivedUser } = response.data;

      if (success) {
        setToken(receivedToken);
        setUser(receivedUser);

        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Server connection failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await API.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Case-insensitive role helper variables
  const isAuthenticated = !!token;
  const normalizedRole = user?.role ? String(user.role).toLowerCase() : "";
  const isAdmin = normalizedRole === "admin";
  const isPractitioner = normalizedRole === "practitioner";
  const isPatient = normalizedRole === "patient";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isPractitioner,
        isPatient,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
