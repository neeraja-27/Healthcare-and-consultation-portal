const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const {
  createPrescription,
  getPatientPrescriptions,
  getPractitionerPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");


// Practitioner
router.post(
  "/",
  authMiddleware,
  authorizeRole("practitioner"),
  createPrescription
);

router.get(
  "/practitioner",
  authMiddleware,
  authorizeRole("practitioner"),
  getPractitionerPrescriptions
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRole("practitioner"),
  updatePrescription
);


// Patient
router.get(
  "/patient",
  authMiddleware,
  authorizeRole("patient"),
  getPatientPrescriptions
);


// Shared
router.get(
  "/:id",
  authMiddleware,
  getPrescriptionById
);


// Admin
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("admin"),
  deletePrescription
);

module.exports = router;