import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaVenusMars,
  FaStethoscope,
  FaHistory,
  FaGraduationCap,
  FaDollarSign,
  FaUserTag
} from "react-icons/fa";

/* ==========================================================================
   REGISTER COMPONENT
   --------------------------------------------------------------------------
   Handles account creation. It dynamically renders practitioner-specific fields
   based on the selected role, performs validation, and submits registrations
   to the `/auth/register` API.
   ========================================================================== */
const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "Male",
      role: "patient",
      specialization: "",
      experience: "",
      qualification: "",
      consultationFee: "",
    }
  });

  // Watch the "role" field value to dynamically toggle practitioner-specific fields
  const watchedRole = watch("role");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Prepare registration request body
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        role: data.role,
      };

      // 2. Add practitioner parameters conditionally
      if (data.role === "practitioner") {
        payload.specialization = data.specialization;
        payload.experience = Number(data.experience) || 0;
        payload.qualification = data.qualification;
        payload.consultationFee = Number(data.consultationFee) || 0;
      }

      // 3. Make registration call
      const result = await authRegister(payload);
      
      // 4. On success, show confirmation toast and redirect to login
      toast.success(result.message || "Account registered successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: "calc(100vh - 140px)", padding: "2rem 1rem" }}>
      <div className="card" style={{ width: "100%", maxWidth: "600px", padding: "2.5rem" }}>
        
        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", color: "var(--primary-deep)" }}>Create Your Account</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Join our platform as a patient or medical consultant
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Two-column layout for standard details */}
          <div className="grid-cols-2">
            
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <FaUser style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Dr. John Doe / Jane Smith"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <FaEnvelope style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="example@mail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email formatting",
                  },
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <FaLock style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                <FaPhone style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="e.g. +1234567890"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>

            {/* Gender Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                <FaVenusMars style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Gender
              </label>
              <select id="gender" className="form-input" {...register("gender")}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Account Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="role">
                <FaUserTag style={{ marginRight: "0.5rem", color: "var(--text-muted)" }} />
                Join As
              </label>
              <select id="role" className="form-input" {...register("role")}>
                <option value="patient">Patient (Browse & Book)</option>
                <option value="practitioner">Medical Practitioner</option>
              </select>
            </div>

          </div>

          {/* ==========================================================================
             CONDITIONAL PRACTITIONER FIELDS
             --------------------------------------------------------------------------
             Displayed only when the user selects "Practitioner" as their account type.
             ========================================================================== */}
          {watchedRole === "practitioner" && (
            <div style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              backgroundColor: "var(--primary-light)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(37, 99, 235, 0.15)"
            }}>
              <h4 style={{ marginBottom: "1rem", color: "var(--primary-deep)", fontSize: "0.95rem" }}>
                Professional Details (Required for Practitioners)
              </h4>
              
              <div className="grid-cols-2">
                
                {/* Specialization */}
                <div className="form-group">
                  <label className="form-label" htmlFor="specialization">
                    <FaStethoscope style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cardiologist, Dentist"
                    {...register("specialization", {
                      required: watchedRole === "practitioner" ? "Specialization is required" : false
                    })}
                  />
                  {errors.specialization && <span className="form-error">{errors.specialization.message}</span>}
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label className="form-label" htmlFor="experience">
                    <FaHistory style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 5"
                    {...register("experience", {
                      required: watchedRole === "practitioner" ? "Experience is required" : false
                    })}
                  />
                  {errors.experience && <span className="form-error">{errors.experience.message}</span>}
                </div>

                {/* Qualification */}
                <div className="form-group">
                  <label className="form-label" htmlFor="qualification">
                    <FaGraduationCap style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                    Qualification
                  </label>
                  <input
                    id="qualification"
                    type="text"
                    className="form-input"
                    placeholder="e.g. MBBS, MD"
                    {...register("qualification", {
                      required: watchedRole === "practitioner" ? "Qualification is required" : false
                    })}
                  />
                  {errors.qualification && <span className="form-error">{errors.qualification.message}</span>}
                </div>

                {/* Consultation Fee */}
                <div className="form-group">
                  <label className="form-label" htmlFor="consultationFee">
                    <FaDollarSign style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
                    Consultation Fee ($)
                  </label>
                  <input
                    id="consultationFee"
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 100"
                    {...register("consultationFee", {
                      required: watchedRole === "practitioner" ? "Consultation fee is required" : false
                    })}
                  />
                  {errors.consultationFee && <span className="form-error">{errors.consultationFee.message}</span>}
                </div>

              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "1.5rem", height: "45px" }}
          >
            {isSubmitting ? (
              <div className="loader" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "var(--primary)" }}>
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
