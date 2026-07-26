const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
    },

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    allergies: [
      {
        type: String,
      },
    ],

    chronicDiseases: [
      {
        type: String,
      },
    ],

    surgeries: [
      {
        type: String,
      },
    ],

    medications: [
      {
        type: String,
      },
    ],

    emergencyContact: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);