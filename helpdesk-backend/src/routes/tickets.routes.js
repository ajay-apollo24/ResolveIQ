const createCrudRoutes = require('../utils/createCrudRoutes');
const Ticket = require('../models/ticket.model');

module.exports = createCrudRoutes(Ticket);