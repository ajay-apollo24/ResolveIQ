const createCrudRoutes = require('../utils/createCrudRoutes');
const Agent = require('../models/agent.model');

module.exports = (router => {
  createCrudRoutes(Agent)(router);

  // GET /api/agents/by-user/:userId
  router.get('/by-user/:userId', async (req, res) => {
    try {
      const agent = await Agent.findOne({ userId: req.params.userId });
      if (!agent) return res.status(404).json({ error: 'Agent not found' });
      res.json(agent);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
});