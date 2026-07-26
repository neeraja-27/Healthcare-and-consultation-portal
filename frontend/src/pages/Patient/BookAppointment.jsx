import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  FaCalendarPlus,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaDollarSign
} from "react-icons/fa";

/* ==========================================================================
   BOOK APPOINTMENT COMPONENT
   --------------------------------------------------------------------------
   Form component for patients to request a new consultation session.
   Connects to `POST /api/appointments/book`.
   ========================================================================== */
const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctor");

  const [practitioners, setPractitioners] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "10:00 AM - 10:30 AM",
    "11:30 AM - 12:00 PM",
    "02:00 PM - 02:30 PM",
    "03:30 PM - 04:00 PM",
    "05:00 PM - 05:30 PM",
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      practitioner: preselectedDoctorId || "",
      appointmentDate: "",
      timeSlot: timeSlots[0],
      reason: "",
    },
  });

  const watchedPractitionerId = watch("practitioner");

  // Fetch list of practitioners to populate selection dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await API.get("/practitioners");
        if (response.data?.success) {
          setPractitioners(response.data.practitioners || []);
          
          if (preselectedDoctorId) {
            setValue("practitioner", preselectedDoctorId);
          }
        }
      } catch (error) {
        toast.error("Failed to load doctor choices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [preselectedDoctorId, setValue]);

  // Sync currently selected doctor object for fee & specialty info display
  useEffect(() => {
    if (watchedPractitionerId && practitioners.length > 0) {
      const doc = practitioners.find((p) => p._id === watchedPractitionerId);
      setSelectedDoctor(doc || null);
    } else {
      setSelectedDoctor(null);
    }
  }, [watchedPractitionerId, practitioners]);

  // Form submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await API.post("/appointments/book", {
        practitioner: data.practitioner,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        reason: data.reason,
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Appointment booked successfully!");
        navigate("/my-appointments");
      } else {
        toast.error(response.data?.message || "Failed to book appointment.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date formatted as YYYY-MM-DD for min date attribute
  const todayDate = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="loader"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Preparing appointment scheduler...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "700px" }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Book a Consultation</h1>
        <p style={{ color: "var(--text-muted)" }}>Select a practitioner and schedule your appointment slot.</p>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Practitioner Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="practitioner">
              <FaUserMd style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
              Select Healthcare Practitioner
            </label>
            <select
              id="practitioner"
              className="form-input"
              {...register("practitioner", { required: "Please select a practitioner" })}
            >
              <option value="">-- Choose Doctor --</option>
              {practitioners.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} ({doc.specialization || "General Physician"}) - ${doc.consultationFee || 0}
                </option>
              ))}
            </select>
            {errors.practitioner && <span className="form-error">{errors.practitioner.message}</span>}
          </div>

          {/* Selected Doctor Summary Box */}
          {selectedDoctor && (
            <div style={{
              padding: "1rem",
              backgroundColor: "var(--primary-light)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--primary-deep)" }}>
                  Dr. {selectedDoctor.name}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {selectedDoctor.specialization} | Experience: {selectedDoctor.experience || 0} Yrs
                </div>
              </div>
              <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.1rem" }}>
                ${selectedDoctor.consultationFee || 0}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label" htmlFor="appointmentDate">
              <FaCalendarAlt style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
              Select Consultation Date
            </label>
            <input
              id="appointmentDate"
              type="date"
              min={todayDate}
              className="form-input"
              {...register("appointmentDate", { required: "Please select a date" })}
            />
            {errors.appointmentDate && <span className="form-error">{errors.appointmentDate.message}</span>}
          </div>

          {/* Time Slot Picker */}
          <div className="form-group">
            <label className="form-label" htmlFor="timeSlot">
              <FaClock style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
              Preferred Time Slot
            </label>
            <select
              id="timeSlot"
              className="form-input"
              {...register("timeSlot", { required: "Please pick a time slot" })}
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && <span className="form-error">{errors.timeSlot.message}</span>}
          </div>

          {/* Reason for Visit */}
          <div className="form-group">
            <label className="form-label" htmlFor="reason">
              <FaClipboardList style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
              Reason for Visit / Symptoms
            </label>
            <textarea
              id="reason"
              rows="3"
              className="form-input"
              placeholder="Briefly describe your symptoms or reason for consultation..."
              {...register("reason", { required: "Please provide a reason for your visit" })}
            ></textarea>
            {errors.reason && <span className="form-error">{errors.reason.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", height: "45px", marginTop: "1rem", justifyContent: "center" }}
          >
            {isSubmitting ? (
              <div className="loader" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div>
            ) : (
              <>
                <FaCalendarPlus /> Confirm & Book Appointment
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
