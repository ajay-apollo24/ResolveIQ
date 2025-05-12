const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'string', 'select'
  required: { type: Boolean, default: false },
  default: mongoose.Schema.Types.Mixed,
  options: [String] // used only if type === 'select'
}, { _id: false }); // prevent Mongoose from adding _id to subdocs

const TicketTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  fields: [FieldSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
}, { timestamps: true });

module.exports = mongoose.model('TicketType', TicketTypeSchema);
