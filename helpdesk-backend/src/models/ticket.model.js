// models/ticket.model.js
const mongoose = require('mongoose');
const { logBusinessEvent, logError } = require('../utils/logging');

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

// Pre-save middleware to log ticket creation
TicketSchema.pre('save', function(next) {
  if (this.isNew) {
    logBusinessEvent('TICKET_CREATED', {
      ticketId: this._id,
      subject: this.subject,
      type: this.type,
      priority: this.priority,
      agentId: this.agentId
    });
  }
  next();
});

// Pre-update middleware to log ticket changes
TicketSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Log status changes
  if (update.$set && update.$set.status) {
    logBusinessEvent('TICKET_STATUS_CHANGED', {
      ticketId: this._conditions._id,
      oldStatus: this._update.$set.status,
      newStatus: update.$set.status
    });
  }
  
  // Log priority changes
  if (update.$set && update.$set.priority) {
    logBusinessEvent('TICKET_PRIORITY_CHANGED', {
      ticketId: this._conditions._id,
      oldPriority: this._update.$set.priority,
      newPriority: update.$set.priority
    });
  }
  
  // Log stage changes
  if (update.$set && update.$set.stage) {
    logBusinessEvent('TICKET_STAGE_CHANGED', {
      ticketId: this._conditions._id,
      oldStage: this._update.$set.stage,
      newStage: update.$set.stage
    });
  }
  
  // Log agent assignment changes
  if (update.$set && update.$set.agentId) {
    logBusinessEvent('TICKET_AGENT_CHANGED', {
      ticketId: this._conditions._id,
      oldAgentId: this._update.$set.agentId,
      newAgentId: update.$set.agentId
    });
  }
  
  next();
});

// Method to add a note to the ticket
TicketSchema.methods.addNote = async function(authorId, message, type = 'public') {
  try {
    this.notes.push({ authorId, message, type });
    await this.save();
    
    logBusinessEvent('TICKET_NOTE_ADDED', {
      ticketId: this._id,
      authorId,
      noteType: type
    });
    
    return this;
  } catch (error) {
    logError(error, {
      operation: 'ADD_NOTE',
      ticketId: this._id,
      authorId
    });
    throw error;
  }
};

// Method to update ticket status
TicketSchema.methods.updateStatus = async function(newStatus) {
  try {
    const oldStatus = this.status;
    this.status = newStatus;
    await this.save();
    
    logBusinessEvent('TICKET_STATUS_UPDATED', {
      ticketId: this._id,
      oldStatus,
      newStatus
    });
    
    return this;
  } catch (error) {
    logError(error, {
      operation: 'UPDATE_STATUS',
      ticketId: this._id,
      newStatus
    });
    throw error;
  }
};

// Method to assign ticket to agent
TicketSchema.methods.assignToAgent = async function(agentId) {
  try {
    const oldAgentId = this.agentId;
    this.agentId = agentId;
    await this.save();
    
    logBusinessEvent('TICKET_ASSIGNED', {
      ticketId: this._id,
      oldAgentId,
      newAgentId: agentId
    });
    
    return this;
  } catch (error) {
    logError(error, {
      operation: 'ASSIGN_AGENT',
      ticketId: this._id,
      agentId
    });
    throw error;
  }
};

module.exports = mongoose.model('Ticket', TicketSchema);