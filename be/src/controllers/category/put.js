import { StatusCodes } from "http-status-codes";
import Category from "../../models/category.model.js";
import slugify from 'slugify';

// PUT /api/categories/:id
export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Thiếu tên danh mục",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug }, // Cập nhật cả slug
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Không tìm thấy danh mục để cập nhật",
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: "Cập nhật danh mục thành công",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
      error,
    });
  }
};
