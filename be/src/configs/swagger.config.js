import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Breadzy API Documentation',
      version: '1.0.0',
      description: 'API documentation for Breadzy - E-commerce platform for bakery products',
      contact: {
        name: 'Breadzy Team',
        url: 'https://github.com/kittenwarrior-qb/breadzy',
      },
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Development server',
      },
      {
        url: 'https://api.breadzy.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in cookie',
        },
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'john_doe',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
              example: 'user',
            },
            isActive: {
              type: 'boolean',
              description: 'Account active status',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        
        // Product Schema
        Product: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Bánh mì thịt nguội',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly slug',
              example: 'banh-mi-thit-nguoi',
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'Bánh mì thơm ngon với thịt nguội cao cấp',
            },
            category: {
              type: 'string',
              description: 'Category name',
              example: 'Bánh mì',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price',
              example: 25000,
            },
            isHot: {
              type: 'boolean',
              description: 'Hot/Featured product flag',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        
        // Category Schema
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'Category ID',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Category name',
              example: 'Bánh mì',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly slug',
              example: 'banh-mi',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        
        // Variant Schema
        Variant: {
          type: 'object',
          required: ['productSlug', 'name', 'price'],
          properties: {
            _id: {
              type: 'string',
              description: 'Variant ID',
              example: '507f1f77bcf86cd799439011',
            },
            productSlug: {
              type: 'string',
              description: 'Parent product slug',
              example: 'banh-mi-thit-nguoi',
            },
            name: {
              type: 'string',
              description: 'Variant name',
              example: 'Size Lớn',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly slug',
              example: 'size-lon',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Variant price',
              example: 30000,
            },
            gallery: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of image URLs',
              example: ['/uploads/variant1.jpg', '/uploads/variant2.jpg'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        
        // Request Schemas
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 128,
              example: 'password123',
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
          },
        },
        
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        
        CreateProductRequest: {
          type: 'object',
          required: ['name', 'category'],
          properties: {
            name: {
              type: 'string',
              example: 'Bánh mì thịt nguội',
            },
            description: {
              type: 'string',
              example: 'Bánh mì thơm ngon với thịt nguội cao cấp',
            },
            category: {
              type: 'string',
              example: 'Bánh mì',
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 25000,
            },
            isHot: {
              type: 'boolean',
              example: false,
            },
          },
        },
        
        CreateCategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Bánh ngọt',
            },
          },
        },
        
        CreateVariantRequest: {
          type: 'object',
          required: ['productSlug', 'name', 'price'],
          properties: {
            productSlug: {
              type: 'string',
              example: 'banh-mi-thit-nguoi',
            },
            name: {
              type: 'string',
              example: 'Size Lớn',
            },
            price: {
              type: 'number',
              minimum: 0,
              example: 30000,
            },
            gallery: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: [],
            },
          },
        },
        
        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
        
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
        
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email is required',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Variants',
        description: 'Product variant management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
