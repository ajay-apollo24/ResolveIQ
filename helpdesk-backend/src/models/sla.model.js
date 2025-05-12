// models/sla.model.js
const mongoose = require('mongoose');

const SlaSchema = new mongoose.Schema({
    name: String,
    appliesTo: String,
    responseTimeMinutes: Number,
    resolutionTimeMinutes: Number
  }, { timestamps: true });
  
  module.exports = mongoose.model('SLA', SlaSchema);