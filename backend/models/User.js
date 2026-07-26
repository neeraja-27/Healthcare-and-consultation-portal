const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["patient", "practitioner", "admin"],
      default: "patient",
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    // Practitioner-specific fields
    specialization:{
      type: String,
      default: "",
    },

    experience:{
      type: Number,
      default: 0,
    },

    qualification: {
      type:String,
      default:"",
    },

    consultationFee: {
      type:Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;