const createCrudRoutes = require('../utils/createCrudRoutes');
const Stage = require('../models/stage.model');
module.exports = createCrudRoutes(Stage);