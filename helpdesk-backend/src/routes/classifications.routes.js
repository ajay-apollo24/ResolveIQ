const createCrudRoutes = require('../utils/createCrudRoutes');
const Classification = require('../models/classification.model');
module.exports = createCrudRoutes(Classification);