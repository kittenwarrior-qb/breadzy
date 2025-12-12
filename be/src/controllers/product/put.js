import { StatusCodes } from "http-status-codes";
import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";
import slugify from "slugify";

// PUT /api/products/:id
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, isHot } = req.body;

    if (!name || !description || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Thiếu tên, mô tả hoặc danh mục sản phẩm",
      });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName, { lower: true, strict: true });

    const foundCategory = await Category.findOne({ slug: category });
    if (!foundCategory) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Danh mục không hợp lệ",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: trimmedName,
        description,
        slug,
        category: foundCategory.slug,
        isHot: !!isHot,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Không tìm thấy sản phẩm để cập nhật",
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Lỗi phía server",
    });
  }
};
