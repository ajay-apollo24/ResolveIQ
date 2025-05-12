// models/agent.model.js
const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: { type: String, enum: ['agent', 'admin', 'supervisor'], default: 'agent' },
    isActive: { type: Boolean, default: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Agent', AgentSchema);