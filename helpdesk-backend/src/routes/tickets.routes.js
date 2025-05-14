const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const TicketType = require('../models/ticketType.model');
const Classification = require('../models/classification.model');
const { logBusinessEvent, logError, logPerformance } = require('../utils/logging');

// GET all tickets
router.get('/', async (req, res) => {
  const startTime = Date.now();
  try {
    // First get tickets without population to ensure we have the basic data
    const tickets = await Ticket.find();
    
    // Then populate the references if they exist
    const populatedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        try {
          const populatedTicket = await Ticket.findById(ticket._id)
            .populate({
              path: 'agentId',
              model: 'User',
              select: 'name email role'
            });

          // Only try to populate ticketTypeId if it exists
          if (ticket.ticketTypeId) {
            try {
              await populatedTicket.populate({
                path: 'ticketTypeId',
                model: 'TicketType',
                select: 'name'
              });
            } catch (populateError) {
              logError(populateError, {
                operation: 'POPULATE_TICKET_TYPE',
                ticketId: ticket._id
              });
            }
          }

          // Only try to populate classificationId if it exists
          if (ticket.classificationId) {
            try {
              await populatedTicket.populate({
                path: 'classificationId',
                model: 'Classification',
                select: 'name'
              });
            } catch (populateError) {
              logError(populateError, {
                operation: 'POPULATE_CLASSIFICATION',
                ticketId: ticket._id
              });
            }
          }

          return populatedTicket;
        } catch (populateError) {
          // If population fails, return the original ticket
          logError(populateError, {
            operation: 'POPULATE_TICKET',
            ticketId: ticket._id
          });
          return ticket;
        }
      })
    );
    
    logBusinessEvent('TICKETS_FETCHED', {
      count: tickets.length,
      duration: Date.now() - startTime
    });

    res.json(populatedTickets);
  } catch (err) {
    logError(err, {
      operation: 'FETCH_TICKETS',
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

// GET single ticket
router.get('/:id', async (req, res) => {
  const startTime = Date.now();
  try {
    // First get the ticket without population
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      logBusinessEvent('TICKET_NOT_FOUND', {
        ticketId: req.params.id
      });
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Then try to populate the references
    try {
      const populatedTicket = await Ticket.findById(ticket._id)
        .populate({
          path: 'agentId',
          model: 'User',
          select: 'name email role'
        });

      // Only try to populate ticketTypeId if it exists
      if (ticket.ticketTypeId) {
        try {
          await populatedTicket.populate({
            path: 'ticketTypeId',
            model: 'TicketType',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_TICKET_TYPE',
            ticketId: ticket._id
          });
        }
      }

      // Only try to populate classificationId if it exists
      if (ticket.classificationId) {
        try {
          await populatedTicket.populate({
            path: 'classificationId',
            model: 'Classification',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_CLASSIFICATION',
            ticketId: ticket._id
          });
        }
      }

      logBusinessEvent('TICKET_FETCHED', {
        ticketId: ticket._id,
        agentId: ticket.agentId,
        duration: Date.now() - startTime
      });

      res.json(populatedTicket);
    } catch (populateError) {
      // If population fails, return the original ticket
      logError(populateError, {
        operation: 'POPULATE_TICKET',
        ticketId: ticket._id
      });
      res.json(ticket);
    }
  } catch (err) {
    logError(err, {
      operation: 'FETCH_TICKET',
      ticketId: req.params.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error fetching ticket' });
  }
});

// POST new ticket
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    
    // Try to populate the references
    try {
      const populatedTicket = await Ticket.findById(ticket._id)
        .populate({
          path: 'agentId',
          model: 'User',
          select: 'name email role'
        });

      // Only try to populate ticketTypeId if it exists
      if (ticket.ticketTypeId) {
        try {
          await populatedTicket.populate({
            path: 'ticketTypeId',
            model: 'TicketType',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_TICKET_TYPE',
            ticketId: ticket._id
          });
        }
      }

      // Only try to populate classificationId if it exists
      if (ticket.classificationId) {
        try {
          await populatedTicket.populate({
            path: 'classificationId',
            model: 'Classification',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_CLASSIFICATION',
            ticketId: ticket._id
          });
        }
      }

      logBusinessEvent('TICKET_CREATED', {
        ticketId: ticket._id,
        agentId: ticket.agentId,
        duration: Date.now() - startTime
      });

      res.status(201).json(populatedTicket);
    } catch (populateError) {
      // If population fails, return the original ticket
      logError(populateError, {
        operation: 'POPULATE_TICKET',
        ticketId: ticket._id
      });
      res.status(201).json(ticket);
    }
  } catch (err) {
    logError(err, {
      operation: 'CREATE_TICKET',
      data: req.body,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error creating ticket' });
  }
});

// PUT update ticket
router.put('/:id', async (req, res) => {
  const startTime = Date.now();
  try {
    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      logBusinessEvent('TICKET_UPDATE_NOT_FOUND', {
        ticketId: req.params.id
      });
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Try to populate the references
    try {
      const populatedTicket = await Ticket.findById(updated._id)
        .populate({
          path: 'agentId',
          model: 'User',
          select: 'name email role'
        });

      // Only try to populate ticketTypeId if it exists
      if (updated.ticketTypeId) {
        try {
          await populatedTicket.populate({
            path: 'ticketTypeId',
            model: 'TicketType',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_TICKET_TYPE',
            ticketId: updated._id
          });
        }
      }

      // Only try to populate classificationId if it exists
      if (updated.classificationId) {
        try {
          await populatedTicket.populate({
            path: 'classificationId',
            model: 'Classification',
            select: 'name'
          });
        } catch (populateError) {
          logError(populateError, {
            operation: 'POPULATE_CLASSIFICATION',
            ticketId: updated._id
          });
        }
      }

      logBusinessEvent('TICKET_UPDATED', {
        ticketId: updated._id,
        agentId: updated.agentId,
        changes: Object.keys(req.body),
        duration: Date.now() - startTime
      });

      res.json(populatedTicket);
    } catch (populateError) {
      // If population fails, return the original updated ticket
      logError(populateError, {
        operation: 'POPULATE_TICKET',
        ticketId: updated._id
      });
      res.json(updated);
    }
  } catch (err) {
    logError(err, {
      operation: 'UPDATE_TICKET',
      ticketId: req.params.id,
      data: req.body,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error updating ticket' });
  }
});

// DELETE ticket
router.delete('/:id', async (req, res) => {
  const startTime = Date.now();
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);

    if (!deleted) {
      logBusinessEvent('TICKET_DELETE_NOT_FOUND', {
        ticketId: req.params.id
      });
      return res.status(404).json({ message: 'Ticket not found' });
    }

    logBusinessEvent('TICKET_DELETED', {
      ticketId: req.params.id,
      duration: Date.now() - startTime
    });

    res.status(204).send();
  } catch (err) {
    logError(err, {
      operation: 'DELETE_TICKET',
      ticketId: req.params.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error deleting ticket' });
  }
});

module.exports = router;