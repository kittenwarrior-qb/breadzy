import { StatusCodes } from 'http-status-codes';
import Variant from '../../models/variant.model.js';
import Product from '../../models/product.model.js';
import slugify from 'slugify';

// PUT /api/variants/:id
export const updateVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const { productSlug, name, price, gallery } = req.body;

    if (!productSlug || !name || !price) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Thiếu thông tin: productSlug, name hoặc price',
      });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName, { lower: true, strict: true });

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Không tìm thấy sản phẩm tương ứng với productSlug',
      });
    }

    const updatedVariant = await Variant.findByIdAndUpdate(
      id,
      {
        name: trimmedName,
        slug,
        productSlug,
        price: Number(price),
        gallery: gallery || [],
      },
      { new: true }
    );

    if (!updatedVariant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: 'Không tìm thấy biến thể để cập nhật',
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: 'Cập nhật biến thể thành công',
      data: updatedVariant,
    });
  } catch (error) {
    console.error('Lỗi cập nhật biến thể:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Lỗi phía server',
    });
  }
};
