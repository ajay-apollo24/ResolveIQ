// models/agent.model.js
const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['agent', 'admin'],
    default: 'agent'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  department: String,
  skills: [String],
  maxTickets: {
    type: Number,
    default: 10
  },
  currentTickets: {
    type: Number,
    default: 0
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);