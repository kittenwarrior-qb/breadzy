import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

// Load environment variables FIRST - must be imported before other config files
import './configs/env.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { validateEnv } from "./configs/validateEnv.js";
import { CONFIG } from "./configs/constants.js";
import { connectDb } from "./configs/db.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";
import swaggerSpec from "./configs/swagger.config.js";

import productRoute from "./routes/product.route.js";
import categoryRoute from "./routes/category.route.js";
import variantRoute from "./routes/variant.route.js";
import authRoute from "./routes/auth.route.js";

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - Allow all origins in development for Swagger
app.use(cors({
  origin: CONFIG.IS_DEVELOPMENT ? '*' : CONFIG.CORS_ORIGIN,
  credentials: CONFIG.IS_DEVELOPMENT ? false : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging in development
if (CONFIG.IS_DEVELOPMENT) {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/variants", variantRoute);
app.use("/api/auth", authRoute);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Breadzy API Documentation',
}));

// Serve raw OpenAPI spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: CONFIG.NODE_ENV,
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDb();
    
    const server = app.listen(CONFIG.PORT, () => {
      logger.success(`Server đang chạy trên cổng ${CONFIG.PORT}`);
      logger.info(`CORS Origin: ${CONFIG.CORS_ORIGIN}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received. Closing server gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await import('mongoose').then(m => m.default.connection.close());
          logger.info('Database connection closed');
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

