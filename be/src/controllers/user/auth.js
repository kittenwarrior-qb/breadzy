import User from "../../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken } from "../../utils/jwt/GenerateAccessToken.js";
import { generateRefreshToken } from "../../utils/jwt/GenerateRefreshToken.js";
import { isValidEmail, validatePassword } from "../../utils/validators.js";
import { CONFIG, MESSAGES } from "../../configs/constants.js";
import { logger } from "../../utils/logger.js";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  const { password, email } = req.body;

  // Validate required fields
  if (!password || !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: MESSAGES.ERROR.MISSING_FIELDS,
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: 'Email không hợp lệ',
    });
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: passwordValidation.message,
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Email đã tồn tại',
      });
    }

    // Create new user
    const newUser = new User({ password, email: email.toLowerCase() });
    await newUser.save();

    logger.info(`New user registered: ${email}`);

    return res.status(StatusCodes.CREATED).json({
      msg: MESSAGES.SUCCESS.REGISTER,
    });
  } catch (error) {
    logger.error('Error during registration:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: MESSAGES.ERROR.SERVER,
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: MESSAGES.ERROR.MISSING_FIELDS,
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Email không tồn tại',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: 'Tài khoản đã bị vô hiệu hóa',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Sai mật khẩu',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: CONFIG.COOKIE.HTTP_ONLY,
      secure: CONFIG.COOKIE.SECURE,
      sameSite: CONFIG.COOKIE.SAME_SITE,
      maxAge: CONFIG.COOKIE.MAX_AGE,
    });

    logger.info(`User logged in: ${email}`);

    return res.status(StatusCodes.OK).json({
      msg: MESSAGES.SUCCESS.LOGIN,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    });
  } catch (err) {
    logger.error('Error during login:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: MESSAGES.ERROR.SERVER,
    });
  }
};

/**
 * Logout user
 */
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(StatusCodes.OK).json({
    msg: MESSAGES.SUCCESS.LOGOUT,
  });
};

