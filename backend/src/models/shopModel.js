import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

shopSchema.index({ owner: 1 });
shopSchema.index({ owner: 1, name: 1 });

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
