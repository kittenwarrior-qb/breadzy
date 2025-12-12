import { CONFIG } from './constants.js';

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
export const validateEnv = () => {
  const required = [
    'MONGO_URL',
    'JWT_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate JWT_SECRET length
  if (CONFIG.JWT.SECRET.length < 32) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security.\n' +
      'Current length:', CONFIG.JWT.SECRET.length
    );
  }

  // Validate MONGO_URL format
  if (!CONFIG.MONGO_URL.startsWith('mongodb://') && !CONFIG.MONGO_URL.startsWith('mongodb+srv://')) {
    throw new Error('MONGO_URL must start with mongodb:// or mongodb+srv://');
  }

  console.log('✅ Environment variables validated successfully');
};
