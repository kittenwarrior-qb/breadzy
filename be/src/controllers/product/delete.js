import { StatusCodes } from 'http-status-codes';
import Product from "../../models/product.model.js";

// DELETE /api/products/:id
export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: 'Không tìm thấy sản phẩm để xoá',
    });
  }

  res.status(StatusCodes.OK).json({
    msg: 'Xoá sản phẩm thành công',
  });
};
