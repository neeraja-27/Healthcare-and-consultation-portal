const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Extract token
    const token = authHeader.split(" ")[1];

console.log("Received Token:", token);
console.log("JWT Secret:", process.env.JWT_SECRET);

const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log("Decoded Token:", decoded);
const user = await User.findById(decoded.id).select("-password");
console.log("User Found:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
    console.log("JWT Error:", error);

    return res.status(401).json({
        success: false,
        message: error.message
    });
    }
};

module.exports = authMiddleware;