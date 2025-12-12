import { StatusCodes } from "http-status-codes";
import Product from "../../models/product.model.js";
import { PAGINATION, SORT, MESSAGES } from "../../configs/constants.js";
import { validatePagination, isValidObjectId } from "../../utils/validators.js";
import { logger } from "../../utils/logger.js";

/**
 * Get all products with pagination, search, and sorting
 * GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      search = "",
      sortBy = SORT.DEFAULT_SORT_BY,
      sortOrder = SORT.DEFAULT_SORT_ORDER
    } = req.query;

    // Validate pagination
    const { page: validPage, pageSize } = validatePagination(page, PAGINATION.DEFAULT_PAGE_SIZE);

    // Validate sort order
    const validSortOrder = SORT.ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : SORT.DEFAULT_SORT_ORDER;

    // Build search query
    const query = search
      ? { slug: { $regex: search, $options: "i" } }
      : {};

    // Build sort object
    const sort = {};
    sort[sortBy] = validSortOrder === "asc" ? 1 : -1;

    // Get total count
    const total = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .sort(sort)
      .skip((validPage - 1) * pageSize)
      .limit(pageSize);

    return res.status(StatusCodes.OK).json({
      msg: MESSAGES.SUCCESS.FETCHED,
      data: products,
      pagination: {
        total,
        page: validPage,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        sortBy,
        sortOrder: validSortOrder
      },
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: MESSAGES.ERROR.SERVER,
    });
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'ID không hợp lệ',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: MESSAGES.ERROR.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: MESSAGES.SUCCESS.FETCHED,
      data: product,
    });
  } catch (error) {
    logger.error("Error fetching product by ID:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: MESSAGES.ERROR.SERVER,
    });
  }
};

/**
 * Get product by slug
 * GET /api/products/slug/:slug
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: MESSAGES.ERROR.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: MESSAGES.SUCCESS.FETCHED,
      data: product,
    });
  } catch (error) {
    logger.error("Error fetching product by slug:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: MESSAGES.ERROR.SERVER,
    });
  }
};

