// Application constants extracted from environment variables and defaults

export const CONFIG = {
  // Server
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // Database
  MONGO_URL: process.env.MONGO_URL,

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET,
    ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '1h',
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '30d',
  },

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Cookies
  COOKIE: {
    SECURE: process.env.COOKIE_SECURE === 'true',
    HTTP_ONLY: true,
    SAME_SITE: 'lax',
    MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
  },

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Sort constants
export const SORT = {
  DEFAULT_SORT_BY: 'createdAt',
  DEFAULT_SORT_ORDER: 'desc',
  ALLOWED_SORT_ORDERS: ['asc', 'desc'],
};

// Response messages
export const MESSAGES = {
  // Success
  SUCCESS: {
    REGISTER: 'Đăng ký thành công',
    LOGIN: 'Đăng nhập thành công',
    LOGOUT: 'Đăng xuất thành công',
    CREATED: 'Tạo thành công',
    UPDATED: 'Cập nhật thành công',
    DELETED: 'Xóa thành công',
    FETCHED: 'Lấy dữ liệu thành công',
  },
  
  // Errors
  ERROR: {
    SERVER: 'Lỗi phía server',
    NOT_FOUND: 'Không tìm thấy',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
    FORBIDDEN: 'Token không hợp lệ hoặc đã hết hạn',
    BAD_REQUEST: 'Yêu cầu không hợp lệ',
    DUPLICATE: 'Dữ liệu đã tồn tại',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    MISSING_FIELDS: 'Thiếu thông tin bắt buộc',
    INVALID_TOKEN: 'Token không hợp lệ',
    TOKEN_EXPIRED: 'Token đã hết hạn',
  },
};
