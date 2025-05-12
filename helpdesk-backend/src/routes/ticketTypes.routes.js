const createCrudRoutes = require('../utils/createCrudRoutes');
const TicketType = require('../models/ticketType.model');
module.exports = createCrudRoutes(TicketType);