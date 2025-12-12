import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.js';
import { CONFIG } from '../configs/constants.js';

/**
 * Centralized error handling middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', err);

  // Default error
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Lỗi phía server';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} đã tồn tại`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'ID không hợp lệ';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token không hợp lệ';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token đã hết hạn';
  }

  // Send response
  const response = {
    msg: message,
    ...(CONFIG.IS_DEVELOPMENT && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    msg: `Route ${req.originalUrl} không tồn tại`,
  });
};
