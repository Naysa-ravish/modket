const Order = require('../models/Order');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

const createOrder = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product || product.status !== 'available') {
      return res.status(400).json({ message: 'Product unavailable' });
    }

    if (String(product.seller) === String(req.user._id)) {
      return res.status(400).json({ message: 'Cannot buy your own product' });
    }

    const order = await Order.create({
      product: product._id,
      buyer: req.user._id,
      seller: product.seller,
      note: req.body.note,
    });

    product.status = 'pending';
    await product.save();

    await logActivity({
      type: 'order.create',
      actor: req.user._id,
      entityType: 'Order',
      entityId: order._id,
    });

    const io = req.app.get('io');
    io?.to(`user:${product.seller}`).emit('order:new', order);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort('-createdAt')
      .populate('seller', 'name email')
      .populate({
        path: 'product',
        populate: 'images',
      });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .sort('-createdAt')
      .populate('buyer', 'name email')
      .populate({
        path: 'product',
        populate: 'images',
      });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (String(order.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'approved';
    order.approvedAt = new Date();
    await order.save();

    order.product.status = 'sold';
    await order.product.save();

    await logActivity({
      type: 'order.approve',
      actor: req.user._id,
      entityType: 'Order',
      entityId: order._id,
    });

    const io = req.app.get('io');
    io?.to(`product:${order.product._id}`).emit('order:update', order);

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isBuyer = String(order.buyer) === String(req.user._id);
    const isSeller = String(order.seller) === String(req.user._id);

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'cancelled';
    await order.save();

    if (order.product.status !== 'sold') {
      order.product.status = 'available';
      await order.product.save();
    }

    await logActivity({
      type: 'order.cancel',
      actor: req.user._id,
      entityType: 'Order',
      entityId: order._id,
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  approveOrder,
  cancelOrder,
};

