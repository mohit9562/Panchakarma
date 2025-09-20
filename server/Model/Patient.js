const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  prakriti: {
    type: String,
    enum: [
      "Vata",
      "Pitta",
      "Kapha",
      "Vata-Pitta",
      "Pitta-Kapha",
      "Vata-Kapha",
      "Tridosha",
    ],
  },
  vikriti: { type: String },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  assigned_procedure: {
    procedure_id: { type: mongoose.Schema.Types.ObjectId, ref: "Procedure" },
    name: String,
    start_date: Date,
    duration_days: Number,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", PatientSchema);
