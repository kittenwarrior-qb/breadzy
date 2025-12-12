import mongoose from "mongoose";
import slugify from "slugify";

const variantSchema = new mongoose.Schema({
  productSlug: {
    type: String,
    required: [true, 'Product slug là bắt buộc'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Tên biến thể là bắt buộc'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Giá là bắt buộc'],
    min: [0, 'Giá không được âm'],
  },
  gallery: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Indexes for performance
variantSchema.index({ slug: 1 });
variantSchema.index({ productSlug: 1 });

// Auto-generate slug from name
variantSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
    strict: true,
  });

  next();
});

export default mongoose.model("Variant", variantSchema);

