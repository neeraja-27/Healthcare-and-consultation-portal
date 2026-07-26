const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Default Specialists Seed List
const defaultSpecialists = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@hospital.com",
    password: "password123",
    phone: "+1 (555) 234-5678",
    gender: "Female",
    role: "practitioner",
    specialization: "Cardiology",
    experience: 12,
    qualification: "MBBS, MD (Cardiology)",
    consultationFee: 120,
    isVerified: true
  },
  {
    name: "Rajesh Sharma",
    email: "rajesh.sharma@hospital.com",
    password: "password123",
    phone: "+1 (555) 345-6789",
    gender: "Male",
    role: "practitioner",
    specialization: "Neurology",
    experience: 15,
    qualification: "MBBS, DM (Neurology)",
    consultationFee: 150,
    isVerified: true
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@hospital.com",
    password: "password123",
    phone: "+1 (555) 456-7890",
    gender: "Female",
    role: "practitioner",
    specialization: "Dermatology",
    experience: 9,
    qualification: "MBBS, MD (Dermatology)",
    consultationFee: 90,
    isVerified: true
  },
  {
    name: "Michael Chen",
    email: "michael.chen@hospital.com",
    password: "password123",
    phone: "+1 (555) 567-8901",
    gender: "Male",
    role: "practitioner",
    specialization: "Orthopedics",
    experience: 14,
    qualification: "MBBS, MS (Orthopedics)",
    consultationFee: 140,
    isVerified: true
  },
  {
    name: "Priya Patel",
    email: "priya.patel@hospital.com",
    password: "password123",
    phone: "+1 (555) 678-9012",
    gender: "Female",
    role: "practitioner",
    specialization: "Pediatrics",
    experience: 10,
    qualification: "MBBS, MD (Pediatrics)",
    consultationFee: 85,
    isVerified: true
  },
  {
    name: "David Miller",
    email: "david.miller@hospital.com",
    password: "password123",
    phone: "+1 (555) 789-0123",
    gender: "Male",
    role: "practitioner",
    specialization: "General Medicine",
    experience: 8,
    qualification: "MBBS, MD (Internal Medicine)",
    consultationFee: 75,
    isVerified: true
  },
  {
    name: "Ananya Reddy",
    email: "ananya.reddy@hospital.com",
    password: "password123",
    phone: "+1 (555) 890-1234",
    gender: "Female",
    role: "practitioner",
    specialization: "Gynecology",
    experience: 11,
    qualification: "MBBS, MS (Obstetrics & Gynaecology)",
    consultationFee: 110,
    isVerified: true
  },
  {
    name: "Robert Taylor",
    email: "robert.taylor@hospital.com",
    password: "password123",
    phone: "+1 (555) 901-2345",
    gender: "Male",
    role: "practitioner",
    specialization: "Psychiatry",
    experience: 13,
    qualification: "MBBS, MD (Psychiatry)",
    consultationFee: 130,
    isVerified: true
  },
  {
    name: "Sophia Al-Mansoor",
    email: "sophia.almansoor@hospital.com",
    password: "password123",
    phone: "+1 (555) 012-3456",
    gender: "Female",
    role: "practitioner",
    specialization: "Ophthalmology",
    experience: 7,
    qualification: "MBBS, MS (Ophthalmology)",
    consultationFee: 95,
    isVerified: true
  },
  {
    name: "James Wilson",
    email: "james.wilson@hospital.com",
    password: "password123",
    phone: "+1 (555) 123-4567",
    gender: "Male",
    role: "practitioner",
    specialization: "Dentistry",
    experience: 10,
    qualification: "BDS, MDS (Orthodontics)",
    consultationFee: 100,
    isVerified: true
  }
];

// Helper to auto-seed doctors if database count is low
const autoSeedPractitioners = async () => {
  try {
    const count = await User.countDocuments({ role: "practitioner" });
    if (count < 5) {
      for (const doc of defaultSpecialists) {
        const exists = await User.findOne({ email: doc.email });
        if (!exists) {
          const hashedPassword = await bcrypt.hash(doc.password, 10);
          await User.create({
            ...doc,
            password: hashedPassword
          });
        }
      }
      console.log("Auto-seeded 10 medical specialists into MongoDB.");
    }
  } catch (err) {
    console.error("Auto seed error:", err);
  }
};

// Add Practitioner (Admin/System)
const addPractitioner = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            gender,
            specialization,
            experience,
            qualification,
            consultationFee
        } = req.body;

        const existingPractitioner = await User.findOne({ email });

        if (existingPractitioner) {
            return res.status(400).json({
                success: false,
                message: "Practitioner already exists with this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password || "password123", 10);

        const practitioner = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || "+1 (555) 000-0000",
            gender: gender || "Other",
            role: "practitioner",
            specialization: specialization || "General Medicine",
            experience: Number(experience) || 0,
            qualification: qualification || "MBBS",
            consultationFee: Number(consultationFee) || 0,
            isVerified: true
        });

        res.status(201).json({
            success: true,
            message: "Practitioner added successfully.",
            practitioner
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get All Practitioners
const getAllPractitioners = async (req, res) => {
    try {
        // Auto-seed if database is empty or low
        await autoSeedPractitioners();

        const practitioners = await User.find({
            role: "practitioner"
        }).select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: practitioners.length,
            practitioners
        });

    } catch (error) {
        console.error("Get Practitioners Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Practitioner By ID
const getPractitionerById = async (req, res) => {
    try {
        const practitioner = await User.findOne({
            _id: req.params.id,
            role: "practitioner"
        }).select("-password");

        if (!practitioner) {
            return res.status(404).json({
                success: false,
                message: "Practitioner not found."
            });
        }

        res.status(200).json({
            success: true,
            practitioner
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update Practitioner Profile
const updatePractitioner = async (req, res) => {
    try {
        const practitioner = await User.findOneAndUpdate(
            { _id: req.params.id, role: "practitioner" },
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!practitioner) {
            return res.status(404).json({
                success: false,
                message: "Practitioner not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Practitioner profile updated successfully.",
            practitioner
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete Practitioner
const deletePractitioner = async (req, res) => {
    try {
        const practitioner = await User.findOneAndDelete({
            _id: req.params.id,
            role: "practitioner"
        });

        if (!practitioner) {
            return res.status(404).json({
                success: false,
                message: "Practitioner not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Practitioner deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    addPractitioner,
    getAllPractitioners,
    getPractitionerById,
    updatePractitioner,
    deletePractitioner
};