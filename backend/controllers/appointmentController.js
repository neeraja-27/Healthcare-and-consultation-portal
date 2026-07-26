const Appointment = require("../models/Appointment");


// Patient books appointment
const bookAppointment = async (req, res) => {
    try {

        const {
            practitioner,
            appointmentDate,
            timeSlot,
            reason
        } = req.body;

        const appointment = await Appointment.create({
            patient: req.user._id,
            practitioner,
            appointmentDate,
            timeSlot,
            reason
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Patient appointments
const getMyAppointments = async (req, res) => {
    try {

        const appointments = await Appointment.find({
            patient: req.user._id
        })
        .populate("practitioner", "name specialization consultationFee")
        .sort({ appointmentDate: -1 });

        res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Practitioner appointments
const getPractitionerAppointments = async (req, res) => {
    try {

        const appointments = await Appointment.find({
            practitioner: req.user._id
        })
        .populate("patient", "name email phone")
        .sort({ appointmentDate: -1 });

        res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// Update appointment status
const updateAppointmentStatus = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        appointment.status = req.body.status;

        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully.",
            appointment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// Cancel Appointment
const cancelAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        appointment.status = "Cancelled";

        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


module.exports = {
    bookAppointment,
    getMyAppointments,
    getPractitionerAppointments,
    updateAppointmentStatus,
    cancelAppointment
};