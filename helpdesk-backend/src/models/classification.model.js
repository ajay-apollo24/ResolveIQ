// models/classification.model.js
const mongoose = require('mongoose');

const ClassificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  sla: {
    type: Number,  // SLA in hours
    default: 24
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Classification', ClassificationSchema);