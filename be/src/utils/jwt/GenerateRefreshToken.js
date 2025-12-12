import jwt from "jsonwebtoken";
import { CONFIG } from "../../configs/constants.js";

/**
 * Generates a JWT refresh token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (id, role) => {
  if (!id || !role) {
    throw new Error('User ID and role are required to generate refresh token');
  }

  return jwt.sign({ id, role }, CONFIG.JWT.SECRET, {
    expiresIn: CONFIG.JWT.REFRESH_EXPIRY,
  });
};