const express = require("express");
const router = express.Router();
const { registerUser,loginUser} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post("/register", registerUser);
router.post("/login", loginUser);


// Protected Route
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });
});

// Only Admin
router.get("/admin",authMiddleware,authorizeRole("admin"),(req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

// Only Practitioner
router.get("/practitioner",authMiddleware,authorizeRole("practitioner"),(req, res) => {
        res.json({
            success: true,
            message: "Welcome Practitioner"
        });
    }
);

// Only Patient
router.get("/patient",authMiddleware,authorizeRole("patient"),(req, res) => {
        res.json({
            success: true,
            message: "Welcome Patient"
        });
    }
);

module.exports = router;