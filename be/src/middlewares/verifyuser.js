import { StatusCodes } from "http-status-codes";
import { verifyTokens } from "../utils/jwt/VerifyTokens.js";
import { MESSAGES } from "../configs/constants.js";

/**
 * Middleware to verify JWT token from Authorization header
 */
export const verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: MESSAGES.ERROR.UNAUTHORIZED,
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: MESSAGES.ERROR.UNAUTHORIZED,
    });
  }

  try {
    const decoded = verifyTokens(token);
    req.user = decoded;
    next();
  } catch (err) {
    const statusCode = err.message.includes('hết hạn') 
      ? StatusCodes.UNAUTHORIZED 
      : StatusCodes.FORBIDDEN;
    
    return res.status(statusCode).json({
      msg: err.message || MESSAGES.ERROR.INVALID_TOKEN,
    });
  }
};

