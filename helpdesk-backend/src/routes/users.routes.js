// routes/users.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');
const { logBusinessEvent, logError, logPerformance, logSecurityEvent } = require('../utils/logging');

// GET all users (admin only)
router.get('/', authMiddleware, async (req, res) => {
  const startTime = Date.now();
  try {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        path: '/api/users',
        method: 'GET'
      });
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find().select('-password');
    
    logBusinessEvent('USERS_FETCHED', {
      requestedBy: req.user.id,
      count: users.length,
      role: req.user.role
    });

    logPerformance('FETCH_ALL_USERS', Date.now() - startTime, {
      count: users.length,
      requestedBy: req.user.id
    });

    res.json(users);
  } catch (err) {
    logError(err, {
      operation: 'FETCH_ALL_USERS',
      requestedBy: req.user.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Could not fetch users' });
  }
});

// GET single user (by ID)
router.get('/:id', authMiddleware, async (req, res) => {
  const startTime = Date.now();
  try {
    // Check if user is requesting their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      logSecurityEvent('UNAUTHORIZED_USER_ACCESS', {
        requestedBy: req.user.id,
        requestedUser: req.params.id,
        role: req.user.role
      });
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      logBusinessEvent('USER_NOT_FOUND', {
        requestedBy: req.user.id,
        requestedUser: req.params.id
      });
      return res.status(404).json({ message: 'User not found' });
    }

    logBusinessEvent('USER_FETCHED', {
      requestedBy: req.user.id,
      fetchedUser: req.params.id,
      role: req.user.role
    });

    logPerformance('FETCH_USER', Date.now() - startTime, {
      requestedBy: req.user.id,
      fetchedUser: req.params.id
    });

    res.json(user);
  } catch (err) {
    logError(err, {
      operation: 'FETCH_USER',
      requestedBy: req.user.id,
      requestedUser: req.params.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// PUT update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  const startTime = Date.now();
  try {
    // Check if user is updating their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      logSecurityEvent('UNAUTHORIZED_PROFILE_UPDATE', {
        requestedBy: req.user.id,
        targetUser: req.params.id,
        role: req.user.role
      });
      return res.status(403).json({ message: 'Access denied' });
    }

    // Prevent updating sensitive fields unless admin
    if (req.user.role !== 'admin') {
      delete req.body.role;
      delete req.body.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      logBusinessEvent('USER_UPDATE_NOT_FOUND', {
        requestedBy: req.user.id,
        targetUser: req.params.id
      });
      return res.status(404).json({ message: 'User not found' });
    }

    logBusinessEvent('USER_UPDATED', {
      requestedBy: req.user.id,
      updatedUser: req.params.id,
      changes: Object.keys(req.body)
    });

    logPerformance('UPDATE_USER', Date.now() - startTime, {
      requestedBy: req.user.id,
      updatedUser: req.params.id
    });

    res.json(updatedUser);
  } catch (err) {
    logError(err, {
      operation: 'UPDATE_USER',
      requestedBy: req.user.id,
      targetUser: req.params.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE user (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const startTime = Date.now();
  try {
    if (req.user.role !== 'admin') {
      logSecurityEvent('UNAUTHORIZED_USER_DELETION', {
        requestedBy: req.user.id,
        targetUser: req.params.id,
        role: req.user.role
      });
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      logBusinessEvent('USER_DELETE_NOT_FOUND', {
        requestedBy: req.user.id,
        targetUser: req.params.id
      });
      return res.status(404).json({ message: 'User not found' });
    }

    logBusinessEvent('USER_DELETED', {
      requestedBy: req.user.id,
      deletedUser: req.params.id
    });

    logPerformance('DELETE_USER', Date.now() - startTime, {
      requestedBy: req.user.id,
      deletedUser: req.params.id
    });

    res.status(204).send();
  } catch (err) {
    logError(err, {
      operation: 'DELETE_USER',
      requestedBy: req.user.id,
      targetUser: req.params.id,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;