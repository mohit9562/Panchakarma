const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema(
  {
    start: { type: String, default: "09:00" }, // store as "HH:mm"
    end: { type: String, default: "17:00" },
  },
  { _id: false }
); // disable _id for subdoc

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  specialization: {
    type: String,
    enum: ["Ayurveda", "Panchakarma", "General Medicine", "Other"],
    default: "Ayurveda",
  },
  qualification: { type: String },
  experience_years: { type: Number },
  clinic_name: { type: String },
  clinic_address: { type: String },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  slot_duration_minutes: { type: Number, default: 30 },
  working_hours: { type: WorkingHoursSchema, default: () => ({}) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
