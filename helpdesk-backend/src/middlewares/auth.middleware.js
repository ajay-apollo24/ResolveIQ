// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { logSecurityEvent, logError } = require('../utils/logging');

const authMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const authHeader = req.headers.authorization;

  // Log authentication attempt
  logSecurityEvent('AUTH_ATTEMPT', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurityEvent('AUTH_FAILED_NO_TOKEN', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };

    // Log successful authentication
    logSecurityEvent('AUTH_SUCCESSFUL', {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
      path: req.path,
      method: req.method,
      duration: Date.now() - startTime
    });

    next();
  } catch (err) {
    logError(err, {
      operation: 'AUTH_VERIFICATION',
      path: req.path,
      method: req.method,
      duration: Date.now() - startTime
    });

    logSecurityEvent('AUTH_FAILED_INVALID_TOKEN', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
