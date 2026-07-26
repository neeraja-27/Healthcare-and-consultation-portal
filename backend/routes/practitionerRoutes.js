const express = require("express");

const router = express.Router();

const {
    addPractitioner,
    getAllPractitioners,
    getPractitionerById,
    updatePractitioner,
    deletePractitioner
} = require("../controllers/practitionerController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

// Public Routes
router.get("/", getAllPractitioners);
router.get("/:id", getPractitionerById);

// Admin Routes
router.post(
    "/",
    authMiddleware,
    authorizeRole("admin"),
    addPractitioner
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    updatePractitioner
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("admin"),
    deletePractitioner
);

module.exports = router;