import { StatusCodes } from 'http-status-codes';
import Category from "../../models/category.model.js";

// DELETE /api/category/:id
export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      msg: "Xoá danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi xoá danh mục:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};
