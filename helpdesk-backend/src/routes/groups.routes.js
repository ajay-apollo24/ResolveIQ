const createCrudRoutes = require('../utils/createCrudRoutes');
const Group = require('../models/group.model');
module.exports = createCrudRoutes(Group);