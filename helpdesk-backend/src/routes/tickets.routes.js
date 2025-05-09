const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');

// GET /api/tickets - fetch all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error });
  }
});

// POST /api/tickets - create a new ticket
router.post('/', async (req, res) => {
  try {
    const newTicket = new Ticket(req.body);
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error });
  }
});

// GET /api/tickets/:id - get one ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error });
  }
});

module.exports = router;