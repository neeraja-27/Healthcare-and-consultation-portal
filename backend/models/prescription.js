const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      default: "General Medicine"
    },
    dosage: {
      type: String,
      default: "As directed"
    },
    frequency: {
      type: String,
      default: "Daily"
    },
    duration: {
      type: String,
      default: "5 Days"
    }
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    practitioner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
    },

    medicines: [medicineSchema],

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);