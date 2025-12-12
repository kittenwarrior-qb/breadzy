import { StatusCodes } from "http-status-codes";
import Category from "../../models/category.model.js";
import slugify from "slugify";
// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Thiếu tên danh mục",
      });
    }

    const nameTrimmed = name.trim();
    const slug = slugify(nameTrimmed, { lower: true, strict: true });

    const existingByName = await Category.findOne({ name: nameTrimmed });
    if (existingByName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Tên danh mục đã tồn tại",
      });
    }

    const existingBySlug = await Category.findOne({ slug });
    if (existingBySlug) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Tên danh mục, slug đã tồn tại",
      });
    }

    const category = await Category.create({ name: nameTrimmed });

    return res.status(StatusCodes.CREATED).json({
      msg: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};


