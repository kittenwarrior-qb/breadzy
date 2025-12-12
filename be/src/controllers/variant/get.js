import { StatusCodes } from "http-status-codes";
import variantModel from "../../models/variant.model.js";
import productModel from "../../models/product.model.js";

export const getFirstVariantFromProducts = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const pageSize = 10;

    const productQuery = {};
    if (search) {
      productQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const allProducts = await productModel.find(productQuery).sort(sort);

    const productsWithVariant = [];

    for (const product of allProducts) {
      const variant = await variantModel
        .findOne({ productSlug: product.slug })
        .sort({ createdAt: -1 }); 

      if (variant) {
        productsWithVariant.push({ product, variant });
      }
    }

    const total = productsWithVariant.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedData = productsWithVariant.slice(start, end);

    return res.status(StatusCodes.OK).json({
      msg: "Lấy danh sách sản phẩm kèm 1 biến thể thành công",
      data: paginatedData,
      pagination: {
        total,
        page: Number(page),
        pageSize,
        totalPages,
        sortBy,
        sortOrder,
      },
    });

  } catch (error) {
    console.error("Lỗi lấy danh sách biến thể:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};

export const getAllVariantsByProductSlug = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      sortBy = "createdAt", 
      sortOrder = "desc"
    } = req.query;

    const { productSlug } = req.params;
    const pageSize = 10;

    const query = {
      productSlug,
      ...(search && {
        $or: [
          { slug: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } }
        ]
      })
    };

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await variantModel.countDocuments(query);

    const variants = await variantModel.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.status(StatusCodes.OK).json({
      msg: "Lấy danh sách biến thể thành công",
      data: variants,
      pagination: {
        total,
        page: Number(page),
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách biến thể:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};

export const getAllVariants = async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query;
    const pageSize = 10;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await variantModel.countDocuments(query);
    const variants = await variantModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    return res.status(StatusCodes.OK).json({
      msg: "Lấy danh sách variant thành công",
      data: variants,
      pagination: {
        total,
        page: Number(page),
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Lỗi lấy variant:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};

// GET /api/variants/:id
export const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await variantModel.findById(id);

    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Không tìm thấy variant",
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: "Lấy variant thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Lỗi lấy variant theo ID:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};

// GET /api/variants/slug/:slug
export const getVariantBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const variant = await variantModel.findOne({ slug });

    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Không tìm thấy variant",
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: "Lấy variant thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Lỗi lấy variant theo slug:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};
