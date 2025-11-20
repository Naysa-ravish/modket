const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    path: String,
    url: String,
    mimetype: String,
    size: Number,
    ownerType: {
      type: String,
      enum: ['Product', 'User'],
      default: 'Product',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'ownerType',
    },
  },
  { timestamps: true },
);

const Image = mongoose.model('Image', imageSchema);

module.exports = {
  Image,
  imageSchema,
};

