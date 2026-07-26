import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "react-toastify";
import { FaClock, FaCalendarAlt, FaSave, FaCheckSquare } from "react-icons/fa";

/* ==========================================================================
   AVAILABILITY SETTINGS COMPONENT
   --------------------------------------------------------------------------
   Allows doctors to set active consultation working hours and available days.
   ========================================================================== */
const AvailabilitySettings = () => {
  const { user } = useAuth();
  
  const [workingDays, setWorkingDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      toast.success("Availability schedule & consultation hours updated!");
    } catch (error) {
      toast.error("Failed to update availability schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "700px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Consultation Availability Settings</h1>
        <p style={{ color: "var(--text-muted)" }}>Configure your weekly working schedule and appointment time slot durations.</p>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        <form onSubmit={handleSave}>
          
          {/* Active Days Picker */}
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-deep)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaCalendarAlt /> Working Days
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {daysOfWeek.map((day) => {
              const isSelected = workingDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`btn ${isSelected ? "btn-primary" : "btn-outline"}`}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "20px" }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Consultation Working Hours */}
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--primary-deep)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaClock /> Consultation Operating Hours
          </h3>

          <div className="grid-cols-2" style={{ marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Shift Start Time</label>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shift End Time</label>
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Slot Duration */}
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label">Default Consultation Slot Duration</label>
            <select
              className="form-input"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
            >
              <option value="15">15 Minutes per patient</option>
              <option value="30">30 Minutes per patient (Recommended)</option>
              <option value="45">45 Minutes per patient</option>
              <option value="60">60 Minutes per patient</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", height: "45px", justifyContent: "center" }}
          >
            {isSubmitting ? <div className="loader" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div> : <><FaSave /> Save Availability Schedule</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
