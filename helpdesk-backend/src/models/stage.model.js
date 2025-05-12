// models/stage.model.js
const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
    name: String,
    order: Number,
    type: String
  }, { timestamps: true });
  
  module.exports = mongoose.model('Stage', StageSchema);