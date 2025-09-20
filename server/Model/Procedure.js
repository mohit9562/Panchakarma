const mongoose = require("mongoose");

const ProcedureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration_days: { type: Number, required: true },
  indication: [String],
  pre_instructions: [String],
  procedure_notes: [String],
  post_instructions: {
    immediate: [String],
    diet: [String],
    lifestyle: [String],
  },
  procedure_steps: [
    {
      name: String,
      duration_hours: Number,
      optional: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Procedure", ProcedureSchema);
