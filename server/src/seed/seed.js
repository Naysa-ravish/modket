require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Question = require('../models/Question');
const Activity = require('../models/Activity');
const { Image } = require('../models/Image');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Question.deleteMany(),
    Activity.deleteMany(),
    Image.deleteMany(),
  ]);

  const seller = await User.create({
    name: 'Seller One',
    email: 'seller@modyuniversity.ac.in',
    password: 'Password123',
    isSeller: true,
    sellerProfile: {
      shopName: 'Seller Hub',
      pickupPoint: 'Hostel Lobby',
    },
  });

  const buyer = await User.create({
    name: 'Buyer One',
    email: 'buyer@modyuniversity.ac.in',
    password: 'Password123',
  });

  const product = await Product.create({
    title: 'Scientific Calculator',
    description: 'Lightly used Casio calculator, perfect for exams.',
    price: 1200,
    category: 'Electronics',
    condition: 'like-new',
    seller: seller._id,
    status: 'available',
  });

  console.log('✅ Seed data inserted');
  mongoose.connection.close();
};

seed().catch((error) => {
  console.error(error);
  mongoose.connection.close();
});

