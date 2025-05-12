// models/classification.model.js
const mongoose = require('mongoose');

const ClassificationSchema = new mongoose.Schema({
    type: String,
    name: String,
    defaultPriority: String,
    autoAssignGroup: String
  }, { timestamps: true });
  
  module.exports = mongoose.model('Classification', ClassificationSchema);