import axios from "axios";

// Create an Axios instance with standard configurations
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL of our backend Express server
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================================================
   INTERCEPTOR: Attaching JWT to Authorization Header
   --------------------------------------------------------------------------
   Before any request is sent, this interceptor runs. It checks if there is
   a token stored in localStorage. If yes, it appends the "Bearer <token>"
   value to the Authorization header, validating the user to the backend.
   ========================================================================== */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ==========================================================================
   INTERCEPTOR: Handling Global Errors (e.g., 401 Unauthorized)
   --------------------------------------------------------------------------
   If a backend API returns 401 (Unauthorized) or 403 (Forbidden), it implies
   the token is expired or invalid. In a production environment, we should
   log the user out automatically to protect security.
   ========================================================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token has expired or is invalid, remove it and log out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Optionally redirect to login page (can also be handled inside components)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
