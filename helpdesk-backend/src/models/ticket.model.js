// models/ticket.model.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  subject: String,
  description: String,
  type: String,
  status: String,
  stage: String,
  priority: String,
  classificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classification' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  ticketTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType' },
  tags: [String],
  externalRefs: {
    customerId: String,
    orderId: String
  },
  customFields: mongoose.Schema.Types.Mixed,
  notes: [
    {
      authorId: mongoose.Schema.Types.ObjectId,
      type: { type: String, enum: ['public', 'private'], default: 'public' },
      message: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);