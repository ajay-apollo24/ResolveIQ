const { logger } = require('../config/logger/logger');

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
};

// Database operation logging
const logDatabaseOperation = (operation, model, query, result, error = null) => {
  const logData = {
    operation,
    model,
    query,
    result: result ? 'success' : 'failure',
    error: error ? error.message : null,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    logger.error('Database Operation Failed', logData);
  } else {
    logger.info('Database Operation', logData);
  }
};

// API request logging
const logApiRequest = (req, res, duration) => {
  logger.http({
    type: 'API Request',
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
};

// Error logging with context
const logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Performance logging
const logPerformance = (operation, duration, metadata = {}) => {
  logger.info({
    type: 'Performance',
    operation,
    duration: `${duration}ms`,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};

// Security event logging
const logSecurityEvent = (event, details) => {
  logger.warn({
    type: 'Security Event',
    event,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Business logic logging
const logBusinessEvent = (event, data) => {
  logger.info({
    type: 'Business Event',
    event,
    data,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  LOG_LEVELS,
  logDatabaseOperation,
  logApiRequest,
  logError,
  logPerformance,
  logSecurityEvent,
  logBusinessEvent,
}; 