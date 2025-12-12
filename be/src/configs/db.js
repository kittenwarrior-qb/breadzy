import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { CONFIG } from "./constants.js";

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectDb = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(CONFIG.MONGO_URL, connectionOptions);
    
    if (conn.connection.readyState === 1) {
      logger.success("Kết nối database thành công!");
      
      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.success('MongoDB reconnected successfully');
      });
    } else {
      throw new Error("Kết nối database thất bại!");
    }
  } catch (error) {
    logger.error(`Lỗi kết nối database (${retries} retries left):`, error);
    
    if (retries > 0) {
      logger.info(`Đang thử kết nối lại sau 5 giây...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDb(retries - 1);
    }
    
    throw new Error(`Không thể kết nối database sau nhiều lần thử: ${error.message}`);
  }
};

