const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  customer: { type: String, required: true },
  email: String,
  phone: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  group: String,
  tags: [String],
  notes: [
    {
      type: { type: String, enum: ['public', 'private'], default: 'public' },
      text: String,
      time: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);