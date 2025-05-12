const createCrudRoutes = require('../utils/createCrudRoutes');
const Agent = require('../models/agent.model');
module.exports = createCrudRoutes(Agent);