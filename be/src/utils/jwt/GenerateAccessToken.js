import jwt from "jsonwebtoken";
import { CONFIG } from "../../configs/constants.js";

/**
 * Generates a JWT access token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT access token
 */
export const generateAccessToken = (id, role) => {
  if (!id || !role) {
    throw new Error('User ID and role are required to generate access token');
  }

  return jwt.sign({ id, role }, CONFIG.JWT.SECRET, {
    expiresIn: CONFIG.JWT.ACCESS_EXPIRY,
  });
};