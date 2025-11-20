const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: String,
    condition: {
      type: String,
      enum: ['new', 'like-new', 'used', 'heavily-used'],
      default: 'used',
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold'],
      default: 'available',
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    tags: [String],
    location: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);

