const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');

// GET all users (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users' });
  }
});

// GET single user (by ID)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Future: PUT /:id to update profile, etc.

module.exports = router;