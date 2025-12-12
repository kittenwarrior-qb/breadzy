import mongoose from "mongoose";
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Giá không được âm'],
  },
  isHot: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isHot: 1 });
productSchema.index({ createdAt: -1 });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();

  this.slug = slugify(this.name, {
    replacement: '-',
    lower: true,
    strict: true,
  });

  next();
});

export default mongoose.model("Product", productSchema);