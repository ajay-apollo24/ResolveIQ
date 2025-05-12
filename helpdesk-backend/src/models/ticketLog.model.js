// models/ticketLog.model.js
const TicketLogSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    action: String,
    from: String,
    to: String,
    actorId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('TicketLog', TicketLogSchema);