const express = require('express');

const createCrudRoutes = (Model) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const items = await Model.find();
    res.json(items);
  });

  router.get('/:id', async (req, res) => {
    const item = await Model.findById(req.params.id);
    res.json(item);
  });

  router.post('/', async (req, res) => {
    const item = new Model(req.body);
    await item.save();
    res.status(201).json(item);
  });

  router.put('/:id', async (req, res) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  });

  router.delete('/:id', async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });

  return router;
};

module.exports = createCrudRoutes;