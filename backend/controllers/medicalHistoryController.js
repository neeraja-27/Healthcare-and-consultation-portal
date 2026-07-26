const MedicalHistory = require("../models/medicalHistory");


// Create Medical History
const createMedicalHistory = async (req, res) => {
  try {

    const existingHistory = await MedicalHistory.findOne({
      patient: req.user._id,
    });

    if (existingHistory) {
      return res.status(400).json({
        success: false,
        message: "Medical history already exists.",
      });
    }

    const medicalHistory = await MedicalHistory.create({
      patient: req.user._id,
      bloodGroup: req.body.bloodGroup,
      height: req.body.height,
      weight: req.body.weight,
      allergies: req.body.allergies,
      chronicDiseases: req.body.chronicDiseases,
      surgeries: req.body.surgeries,
      medications: req.body.medications,
      emergencyContact: req.body.emergencyContact,
    });

    res.status(201).json({
      success: true,
      message: "Medical history created successfully.",
      medicalHistory,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


// Patient View Own Medical History
const getMyMedicalHistory = async (req, res) => {

  try {

    const medicalHistory = await MedicalHistory.findOne({
      patient: req.user._id,
    }).populate("patient", "name email");

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history not found.",
      });
    }

    res.status(200).json({
      success: true,
      medicalHistory,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


// Practitioner View Patient Medical History
const getPatientMedicalHistory = async (req, res) => {

  try {

    const medicalHistory = await MedicalHistory.findOne({
      patient: req.params.patientId,
    }).populate("patient", "name email");

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history not found.",
      });
    }

    res.status(200).json({
      success: true,
      medicalHistory,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


// Update Medical History
const updateMedicalHistory = async (req, res) => {

  try {

    const medicalHistory = await MedicalHistory.findOne({
      patient: req.user._id,
    });

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history not found.",
      });
    }

    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      {
        patient: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Medical history updated successfully.",
      medicalHistory: updatedHistory,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


// Delete Medical History (Admin)
const deleteMedicalHistory = async (req, res) => {

  try {

    const medicalHistory = await MedicalHistory.findById(req.params.id);

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history not found.",
      });
    }

    await MedicalHistory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Medical history deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


module.exports = {
  createMedicalHistory,
  getMyMedicalHistory,
  getPatientMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
};