// models/ticketType.model.js
const TicketTypeSchema = new mongoose.Schema({
    name: String,
    description: String,
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    fields: [
      {
        name: String,
        label: String,
        type: String,
        required: Boolean,
        default: mongoose.Schema.Types.Mixed,
        options: [String] // for select fields
      }
    ],
    createdBy: mongoose.Schema.Types.ObjectId
  }, { timestamps: true });
  
  module.exports = mongoose.model('TicketType', TicketTypeSchema);