import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg'],
      required: true,
    },
    category: {
      type: String,
      enum: ['snacks', 'main_course', 'desserts', 'beverages', 'fast_food', 'others'],
      required: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

itemSchema.index({ shop: 1 });
itemSchema.index({ shop: 1, category: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;
