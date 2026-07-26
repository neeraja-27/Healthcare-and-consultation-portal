const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    // Get data from request body
    const {
      name,
      email,
      password,
      phone,
      gender,
      role,
      specialization,
      experience,
      qualification,
      consultationFee,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      role,
      specialization,
      experience,
      qualification,
      consultationFee,
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const loginUser = async(req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

         const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send Response
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    }  catch(error){
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
}
module.exports = {
  registerUser,
  loginUser,
};