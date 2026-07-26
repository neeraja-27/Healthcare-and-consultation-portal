import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Local state for password visibility toggle and submission loading state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Handler on successful form client validation
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Invoke login function from our AuthContext
      const result = await login(data.email, data.password);
      
      // 2. Trigger success notification
      toast.success(result.message || "Welcome back!");

      // 3. Perform redirect depending on user role
      if (result.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (result.user.role === "practitioner") {
        navigate("/practitioner-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      // Handle login error feedback
      toast.error(error.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: "calc(100vh - 140px)", padding: "2rem 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
        
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", color: "var(--primary-deep)" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Sign in to access your portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email input field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <FaEnvelope style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address format",
                },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          {/* Password input field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <FaLock style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingRight: "2.5rem" }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {/* Show/Hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "1rem", height: "45px" }}
          >
            {isSubmitting ? <div className="loader" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div> : "Sign In"}
          </button>
        </form>

        {/* Redirect to Register link */}
        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>
            Create new
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
