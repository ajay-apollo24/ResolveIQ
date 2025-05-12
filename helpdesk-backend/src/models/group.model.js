// models/group.model.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);