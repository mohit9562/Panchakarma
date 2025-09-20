require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const { sendAppointmentSMS } = require("./sms");
const Doctor = require("../Model/Doctor");
const Patient = require("../Model/Patient");
const Procedure = require("../Model/Procedure");
const authenticateUser = require("../Auth/verify");

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// Doctor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    const existing = await Doctor.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword });
    await doctor.save();
    res.status(201).json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doctor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Doctor.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Get all doctors (only name and specialization)
router.get("/patient/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("name specialization");
    res.json({ success: true, doctors });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch doctors" });
  }
});

// Get all procedures (only name and duration_days)
router.get("/patient/procedures", async (req, res) => {
  try {
    const procedures = await Procedure.find().select("name duration_days");
    res.json({ success: true, procedures });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch procedures" });
  }
});




// Get Doctor Available Slots
router.get("/:doctorId/available-slots", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // YYYY-MM-DD
    const doctor = await Doctor.findById(doctorId).populate("patients");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const start = moment(`${date}T${doctor.working_hours.start}`);
    const end = moment(`${date}T${doctor.working_hours.end}`);
    const slotDuration = doctor.slot_duration_minutes;

    let slots = [];
    let current = start.clone();
    while (current.isBefore(end)) {
      slots.push(current.format("HH:mm"));
      current.add(slotDuration, "minutes");
    }

    const bookedSlots = doctor.patients
      .filter((p) => p.assigned_procedure?.start_date)
      .map((p) => p.assigned_procedure.booked_slots.map((s) => s.slot_time))
      .flat();

    const availableSlots = slots.filter((s) => !bookedSlots.includes(s));
    res.json({ date, availableSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Patient Signup + Book Procedure
router.post("/patient/signup", async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      age,
      gender,
      prakriti,
      vikriti,
      doctor_id,
      procedure_id,
      selectedDate,
    } = req.body;
    const existing = await Patient.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const procedure = await Procedure.findById(procedure_id);
    if (!procedure)
      return res.status(404).json({ message: "Procedure not found" });

  

    const patient = new Patient({
      full_name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      prakriti,
      vikriti,
      doctor_id,
      assigned_procedure: {
        procedure_id,
        name: procedure.name,
        start_date: new Date(selectedDate),
        duration_days: procedure.duration_days,
      },
    });

    await patient.save();
     if (patient.phone) {
       await sendAppointmentSMS(
         `${patient.phone}`,
         patient.assigned_procedure.start_date,
         procedure.pre_instructions
       );
     }

    await Doctor.findByIdAndUpdate(doctor_id, {
      $push: { patients: patient._id },
    });

    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
