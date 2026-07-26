const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const {
  createMedicalHistory,
  getMyMedicalHistory,
  getPatientMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
} = require("../controllers/medicalHistoryController");


// Patient
router.post(
  "/",
  authMiddleware,
  authorizeRole("patient"),
  createMedicalHistory
);

router.get(
  "/my",
  authMiddleware,
  authorizeRole("patient"),
  getMyMedicalHistory
);

router.put(
  "/",
  authMiddleware,
  authorizeRole("patient"),
  updateMedicalHistory
);


// Practitioner
router.get(
  "/patient/:patientId",
  authMiddleware,
  authorizeRole("practitioner"),
  getPatientMedicalHistory
);


// Admin
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("admin"),
  deleteMedicalHistory
);

module.exports = router;