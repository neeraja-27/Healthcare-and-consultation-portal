const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const {
    bookAppointment,
    getMyAppointments,
    getPractitionerAppointments,
    updateAppointmentStatus,
    cancelAppointment
} = require("../controllers/appointmentController");


// Patient
router.post(
    "/book",
    authMiddleware,
    authorizeRole("patient"),
    bookAppointment
);

router.get(
    "/my",
    authMiddleware,
    authorizeRole("patient"),
    getMyAppointments
);

router.put(
    "/cancel/:id",
    authMiddleware,
    authorizeRole("patient"),
    cancelAppointment
);


// Practitioner
router.get(
    "/practitioner",
    authMiddleware,
    authorizeRole("practitioner"),
    getPractitionerAppointments
);

router.put(
    "/status/:id",
    authMiddleware,
    authorizeRole("practitioner"),
    updateAppointmentStatus
);

module.exports = router;