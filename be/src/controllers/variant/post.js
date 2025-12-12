  import Variant from '../../models/variant.model.js';
  import Product from '../../models/product.model.js';
  import { StatusCodes } from 'http-status-codes';
  import slugify from 'slugify';

  export const createVariant = async (req, res) => {
    try {
      const { productSlug, name, price, gallery } = req.body;

      if (!productSlug || !name || !price) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Thiếu thông tin bắt buộc: productSlug, name hoặc price',
        });
      }

      const trimmedName = name.trim();
      const variantSlug = slugify(trimmedName, { lower: true, strict: true });

      const product = await Product.findOne({ slug: productSlug });
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          msg: `Không tìm thấy sản phẩm với slug: ${productSlug}`,
        });
      }

      const existingVariant = await Variant.findOne({
        productSlug,
        slug: variantSlug,
      });

      if (existingVariant) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'Biến thể với tên này đã tồn tại cho sản phẩm',
        });
      }

      const newVariant = await Variant.create({
        productSlug,
        name: trimmedName,
        slug: variantSlug,
        price: Number(price),
        gallery: gallery || [],
      });

      return res.status(StatusCodes.CREATED).json({
        msg: 'Tạo biến thể thành công',
        data: newVariant,
      });
    } catch (error) {
      console.error('Lỗi tạo variant:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: 'Lỗi phía server',
      });
    }
  };


export const uploadVariantImages = (req, res) => {
  try {
    if (!req.file || req.file.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: 'Không có file nào được upload',
        data: []
      });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;


    return res.status(StatusCodes.CREATED).json({
      msg: 'Upload ảnh thành công',
      data: url
    });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: 'Lỗi phía server khi upload ảnh',
      data: []
    });
  }
};