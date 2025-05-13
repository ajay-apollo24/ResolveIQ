const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');
const { logSecurityEvent, logError, logBusinessEvent } = require('../utils/logging');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const startTime = Date.now();
  try {
    const { name, email, password, role } = req.body;
    
    logBusinessEvent('SIGNUP_ATTEMPT', { email, role });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logSecurityEvent('DUPLICATE_SIGNUP_ATTEMPT', { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = generateToken(newUser);
    
    logBusinessEvent('USER_CREATED', {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      duration: Date.now() - startTime
    });
    
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    logError(err, {
      operation: 'signup',
      email: req.body.email,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const startTime = Date.now();
  const { email, password } = req.body;
  
  logBusinessEvent('LOGIN_ATTEMPT', { email });
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', { email });
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password.trim());
    
    if (!isMatch) {
      logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
        email,
        userId: user._id
      });
      return res.status(403).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user);
    
    logBusinessEvent('LOGIN_SUCCESSFUL', {
      userId: user._id,
      email: user.email,
      role: user.role,
      duration: Date.now() - startTime
    });
    
    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    logError(err, {
      operation: 'login',
      email: req.body.email,
      duration: Date.now() - startTime
    });
    res.status(500).json({ message: 'Internal server error during login', error: err.message });
  }
});

module.exports = router;