import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, isHot } = req.body;

    if (!name || !category || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Thiếu tên, mô tả hoặc danh mục sản phẩm",
      });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName, { lower: true, strict: true });

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Tên sản phẩm đã tồn tại",
      });
    }

    const foundCategory = await Category.findOne({ slug: category });
    if (!foundCategory) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Danh mục không hợp lệ",
      });
    }

    const product = await Product.create({
      name: trimmedName,
      description,
      slug,
      price: 0, // Sẽ lấy từ variant sau
      category: foundCategory.slug,
      isHot: !!isHot,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};
