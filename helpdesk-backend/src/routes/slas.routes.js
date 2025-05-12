const createCrudRoutes = require('../utils/createCrudRoutes');
const SLA = require('../models/sla.model');
module.exports = createCrudRoutes(SLA);