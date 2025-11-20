const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerProfileSchema = new mongoose.Schema(
  {
    shopName: String,
    about: String,
    pickupPoint: String,
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatarUrl: String,
    phone: String,
    bio: String,
    isSeller: {
      type: Boolean,
      default: false,
    },
    sellerProfile: sellerProfileSchema,
  },
  { timestamps: true },
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

