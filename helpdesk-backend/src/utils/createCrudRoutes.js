const express = require('express');
const { logDatabaseOperation, logError, logBusinessEvent, logPerformance } = require('./logging');

const createCrudRoutes = (Model) => {
  const router = express.Router();
  const modelName = Model.modelName;

  // GET all items
  router.get('/', async (req, res) => {
    const startTime = Date.now();
    try {
      const items = await Model.find();
      
      logPerformance('GET_ALL', Date.now() - startTime, {
        model: modelName,
        count: items.length
      });
      
      res.json(items);
    } catch (err) {
      logError(err, {
        operation: 'GET_ALL',
        model: modelName,
        duration: Date.now() - startTime
      });
      res.status(500).json({ message: 'Error fetching items', error: err.message });
    }
  });

  // GET single item
  router.get('/:id', async (req, res) => {
    const startTime = Date.now();
    try {
      const item = await Model.findById(req.params.id);
      
      if (!item) {
        logBusinessEvent('ITEM_NOT_FOUND', {
          model: modelName,
          id: req.params.id
        });
        return res.status(404).json({ message: 'Item not found' });
      }
      
      logPerformance('GET_ONE', Date.now() - startTime, {
        model: modelName,
        id: req.params.id
      });
      
      res.json(item);
    } catch (err) {
      logError(err, {
        operation: 'GET_ONE',
        model: modelName,
        id: req.params.id,
        duration: Date.now() - startTime
      });
      res.status(500).json({ message: 'Error fetching item', error: err.message });
    }
  });

  // POST new item
  router.post('/', async (req, res) => {
    const startTime = Date.now();
    try {
      const item = new Model(req.body);
      await item.save();
      
      logBusinessEvent('ITEM_CREATED', {
        model: modelName,
        id: item._id,
        data: req.body
      });
      
      logPerformance('CREATE', Date.now() - startTime, {
        model: modelName,
        id: item._id
      });
      
      res.status(201).json(item);
    } catch (err) {
      logError(err, {
        operation: 'CREATE',
        model: modelName,
        data: req.body,
        duration: Date.now() - startTime
      });
      res.status(500).json({ message: 'Error creating item', error: err.message });
    }
  });

  // PUT update item
  router.put('/:id', async (req, res) => {
    const startTime = Date.now();
    try {
      const updated = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      if (!updated) {
        logBusinessEvent('UPDATE_ITEM_NOT_FOUND', {
          model: modelName,
          id: req.params.id
        });
        return res.status(404).json({ message: 'Item not found' });
      }
      
      logBusinessEvent('ITEM_UPDATED', {
        model: modelName,
        id: req.params.id,
        changes: req.body
      });
      
      logPerformance('UPDATE', Date.now() - startTime, {
        model: modelName,
        id: req.params.id
      });
      
      res.json(updated);
    } catch (err) {
      logError(err, {
        operation: 'UPDATE',
        model: modelName,
        id: req.params.id,
        data: req.body,
        duration: Date.now() - startTime
      });
      res.status(500).json({ message: 'Error updating item', error: err.message });
    }
  });

  // DELETE item
  router.delete('/:id', async (req, res) => {
    const startTime = Date.now();
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      
      if (!deleted) {
        logBusinessEvent('DELETE_ITEM_NOT_FOUND', {
          model: modelName,
          id: req.params.id
        });
        return res.status(404).json({ message: 'Item not found' });
      }
      
      logBusinessEvent('ITEM_DELETED', {
        model: modelName,
        id: req.params.id
      });
      
      logPerformance('DELETE', Date.now() - startTime, {
        model: modelName,
        id: req.params.id
      });
      
      res.status(204).send();
    } catch (err) {
      logError(err, {
        operation: 'DELETE',
        model: modelName,
        id: req.params.id,
        duration: Date.now() - startTime
      });
      res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
  });

  return router;
};

module.exports = createCrudRoutes;