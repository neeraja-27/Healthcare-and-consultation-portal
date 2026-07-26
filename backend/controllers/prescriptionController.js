const Prescription = require("../models/prescription");
const Appointment = require("../models/Appointment");

// 1. Create Prescription
const createPrescription = async (req, res) => {
  try {
    const { appointment, diagnosis, medicines, notes } = req.body;

    if (!appointment || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and diagnosis are required.",
      });
    }

    const appointmentData = await Appointment.findById(appointment);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // Verify requesting user is the assigned practitioner
    if (appointmentData.practitioner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You are not the assigned doctor for this appointment.",
      });
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointment });

    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: "A prescription has already been issued for this appointment.",
      });
    }

    // Normalize medicines input into array of valid medicineSchema objects
    let rawMedicinesList = medicines;
    if (typeof medicines === "string") {
      rawMedicinesList = medicines.split(",").map((m) => m.trim()).filter(Boolean);
    }

    if (!Array.isArray(rawMedicinesList)) {
      rawMedicinesList = [];
    }

    const formattedMedicines = rawMedicinesList.map((item) => {
      if (typeof item === "string") {
        return {
          medicineName: item,
          dosage: "As directed",
          frequency: "Daily",
          duration: "5 Days"
        };
      }
      if (typeof item === "object" && item !== null) {
        return {
          medicineName: item.medicineName || item.name || "General Medicine",
          dosage: item.dosage || "As directed",
          frequency: item.frequency || "Daily",
          duration: item.duration || "5 Days"
        };
      }
      return {
        medicineName: String(item),
        dosage: "As directed",
        frequency: "Daily",
        duration: "5 Days"
      };
    });

    const prescription = await Prescription.create({
      appointment,
      patient: appointmentData.patient,
      practitioner: appointmentData.practitioner,
      diagnosis,
      medicines: formattedMedicines,
      notes: notes || "",
    });

    // Mark appointment as Completed upon issuing prescription
    appointmentData.status = "Completed";
    await appointmentData.save();

    res.status(201).json({
      success: true,
      message: "Prescription issued successfully.",
      prescription,
    });

  } catch (error) {
    console.error("Create Prescription Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 2. Get Patient Prescriptions
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user._id,
    })
      .populate("practitioner", "name specialization qualification")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });

  } catch (error) {
    console.error("Get Patient Prescriptions Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 3. Get Practitioner Prescriptions
const getPractitionerPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      practitioner: req.user._id,
    })
      .populate("patient", "name email phone")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });

  } catch (error) {
    console.error("Get Practitioner Prescriptions Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 4. Get Prescription By ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("practitioner", "name specialization qualification")
      .populate("patient", "name email phone")
      .populate("appointment");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    res.status(200).json({
      success: true,
      prescription,
    });

  } catch (error) {
    console.error("Get Prescription By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 5. Update Prescription
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully.",
      prescription,
    });

  } catch (error) {
    console.error("Update Prescription Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// 6. Delete Prescription
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Prescription Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getPractitionerPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
};