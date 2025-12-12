/**
 * Reusable validation functions
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      message: 'Mật khẩu không được vượt quá 128 ký tự',
    };
  }

  return { valid: true, message: '' };
};

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validates slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid slug format
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Sanitizes string input by trimming whitespace
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  return typeof str === 'string' ? str.trim() : '';
};

/**
 * Validates pagination parameters
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @returns {object} { page: number, pageSize: number }
 */
export const validatePagination = (page, pageSize, maxPageSize = 100) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validPageSize = Math.min(
    maxPageSize,
    Math.max(1, parseInt(pageSize) || 10)
  );

  return { page: validPage, pageSize: validPageSize };
};
