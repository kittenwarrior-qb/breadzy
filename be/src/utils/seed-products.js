import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Variant from '../models/variant.model.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: 'Bánh Mì Pate',
    description: 'Bánh mì pate truyền thống với nhân pate thơm ngon, dưa leo, rau thơm và gia vị đặc trưng',
    category: 'Bánh Mì Truyền Thống',
    price: 25000,
    isHot: true,
    variants: [
      { name: 'Bánh Mì Pate Thường', price: 25000 },
      { name: 'Bánh Mì Pate Đặc Biệt', price: 30000 },
      { name: 'Bánh Mì Pate Trứng', price: 28000 },
      { name: 'Bánh Mì Pate Phô Mai', price: 32000 }
    ]
  },
  {
    name: 'Bánh Mì Thịt Nguội',
    description: 'Bánh mì với thịt nguội cao cấp, giăm bông, chả lụa, kèm rau sống tươi ngon',
    category: 'Bánh Mì Truyền Thống',
    price: 30000,
    isHot: true,
    variants: [
      { name: 'Bánh Mì Thịt Nguội Thường', price: 30000 },
      { name: 'Bánh Mì Thịt Nguội Đặc Biệt', price: 35000 },
      { name: 'Bánh Mì Thịt Nguội Phô Mai', price: 38000 },
      { name: 'Bánh Mì Thịt Nguội Trứng', price: 35000 }
    ]
  },
  {
    name: 'Bánh Mì Xíu Mại',
    description: 'Bánh mì xíu mại sốt cà chua đậm đà, thơm ngon, ăn kèm rau thơm và dưa leo',
    category: 'Bánh Mì Đặc Biệt',
    price: 28000,
    isHot: false,
    variants: [
      { name: 'Bánh Mì Xíu Mại Nhỏ', price: 25000 },
      { name: 'Bánh Mì Xíu Mại Vừa', price: 28000 },
      { name: 'Bánh Mì Xíu Mại Lớn', price: 32000 },
      { name: 'Bánh Mì Xíu Mại Phô Mai', price: 35000 }
    ]
  },
  {
    name: 'Bánh Mì Gà Nướng',
    description: 'Bánh mì với gà nướng thơm lừng, ướp gia vị đặc biệt, kèm rau sống và sốt mayonnaise',
    category: 'Bánh Mì Đặc Biệt',
    price: 35000,
    isHot: true,
    variants: [
      { name: 'Bánh Mì Gà Nướng Thường', price: 35000 },
      { name: 'Bánh Mì Gà Nướng Phô Mai', price: 40000 },
      { name: 'Bánh Mì Gà Nướng Trứng', price: 38000 },
      { name: 'Bánh Mì Gà Nướng Đặc Biệt', price: 45000 }
    ]
  },
  {
    name: 'Bánh Mì Trứng Ốp La',
    description: 'Bánh mì với trứng ốp la vàng ươm, giòn rụm, kèm rau thơm và dưa leo tươi',
    category: 'Bánh Mì Chay',
    price: 22000,
    isHot: false,
    variants: [
      { name: 'Bánh Mì Trứng Ốp La 1 Trứng', price: 22000 },
      { name: 'Bánh Mì Trứng Ốp La 2 Trứng', price: 28000 },
      { name: 'Bánh Mì Trứng Ốp La Phô Mai', price: 30000 },
      { name: 'Bánh Mì Trứng Ốp La Đặc Biệt', price: 32000 }
    ]
  },
  {
    name: 'Bánh Mì Chả Cá',
    description: 'Bánh mì với chả cá Nha Trang thơm ngon, kèm rau thơm, dưa leo và sốt đặc biệt',
    category: 'Bánh Mì Đặc Biệt',
    price: 32000,
    isHot: false,
    variants: [
      { name: 'Bánh Mì Chả Cá Thường', price: 32000 },
      { name: 'Bánh Mì Chả Cá Đặc Biệt', price: 38000 },
      { name: 'Bánh Mì Chả Cá Phô Mai', price: 40000 },
      { name: 'Bánh Mì Chả Cá Trứng', price: 37000 }
    ]
  },
  {
    name: 'Bánh Mì Bò Nướng',
    description: 'Bánh mì với thịt bò nướng mềm ngọt, ướp sả ớt thơm lừng, kèm rau sống tươi ngon',
    category: 'Bánh Mì Cao Cấp',
    price: 40000,
    isHot: true,
    variants: [
      { name: 'Bánh Mì Bò Nướng Thường', price: 40000 },
      { name: 'Bánh Mì Bò Nướng Đặc Biệt', price: 48000 },
      { name: 'Bánh Mì Bò Nướng Phô Mai', price: 50000 },
      { name: 'Bánh Mì Bò Nướng Trứng', price: 45000 }
    ]
  },
  {
    name: 'Bánh Mì Chay',
    description: 'Bánh mì chay với đậu hũ chiên giòn, rau củ tươi ngon, sốt chay đặc biệt',
    category: 'Bánh Mì Chay',
    price: 20000,
    isHot: false,
    variants: [
      { name: 'Bánh Mì Chay Thường', price: 20000 },
      { name: 'Bánh Mì Chay Đặc Biệt', price: 25000 },
      { name: 'Bánh Mì Chay Phô Mai', price: 28000 },
      { name: 'Bánh Mì Chay Nấm', price: 27000 }
    ]
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Đã kết nối MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Variant.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');

    // Create products and variants
    for (const productData of products) {
      // Extract variants from product data
      const { variants, ...productInfo } = productData;

      // Create product
      const product = await Product.create(productInfo);
      console.log(`✅ Đã tạo sản phẩm: ${product.name} (slug: ${product.slug})`);

      // Create variants for this product
      for (const variantData of variants) {
        const variant = await Variant.create({
          productSlug: product.slug,
          name: variantData.name,
          price: variantData.price,
          gallery: []
        });
        console.log(`  ✅ Đã tạo biến thể: ${variant.name} (slug: ${variant.slug})`);
      }
    }

    console.log('\n🎉 Seed data hoàn tất!');
    console.log(`📊 Tổng số sản phẩm: ${products.length}`);
    console.log(`📊 Tổng số biến thể: ${products.length * 4}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  }
}

seedProducts();
