const createCrudRoutes = require('../utils/createCrudRoutes');
const TicketLog = require('../models/ticketLog.model');
module.exports = createCrudRoutes(TicketLog);