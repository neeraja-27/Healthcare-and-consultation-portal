const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authroutes = require("./routes/authroutes");
const practitionerRoutes = require("./routes/practitionerRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authroutes);
app.use("/api/practitioners", practitionerRoutes);

app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);

app.get("/",(req,res) =>{
    res.send("Healthcare Booking Portal API is Running...");

})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
