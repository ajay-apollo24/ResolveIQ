const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/users - list all users (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users' });
  }
});

module.exports = router;