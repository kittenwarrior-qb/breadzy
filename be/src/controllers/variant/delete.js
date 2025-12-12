import { StatusCodes } from 'http-status-codes';
import Variant from '../../models/variant.model.js';

// DELETE /api/products/:id
export const deleteVariantById = async (req, res) => {
  const { id } = req.params;
  const deleted = await Variant.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: 'Không tìm thấy biến thể sản phẩm để xoá',
    });
  }

  res.status(StatusCodes.OK).json({
    msg: 'Xoá biến thể sản phẩm thành công',
  });
};
