const Product = require('../models/Product');
const { Image } = require('../models/Image');
const logActivity = require('../utils/activityLogger');

const fileBaseUrl = process.env.FILE_BASE_URL || '/uploads';

const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const attachImages = async (product, files = []) => {
  if (!files.length) return;

  const imageDocs = await Promise.all(
    files.map((file) =>
      Image.create({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: `${fileBaseUrl}/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        ownerType: 'Product',
        owner: product._id,
      }),
    ),
  );

  product.images.push(...imageDocs.map((img) => img._id));
  await product.save();
};

const listProducts = async (req, res, next) => {
  try {
    const filters = { status: 'available' };
    if (req.query.category) filters.category = req.query.category;

    const products = await Product.find(filters)
      .sort('-createdAt')
      .populate('seller', 'name email avatarUrl')
      .populate('images');

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email avatarUrl isSeller')
      .populate('images');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      seller: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      condition: req.body.condition,
      status: 'available',
      tags: parseArray(req.body.tags),
      location: req.body.location,
    });

    if (req.files?.length) {
      await attachImages(product, req.files);
      await logActivity({
        type: 'image.upload',
        actor: req.user._id,
        entityType: 'Product',
        entityId: product._id,
        metadata: { count: req.files.length },
      });
    }

    await product.populate('images');

    await logActivity({
      type: 'product.create',
      actor: req.user._id,
      entityType: 'Product',
      entityId: product._id,
    });

    const io = req.app.get('io');
    io?.emit('product:new', product);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (String(product.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = {
      title: req.body.title ?? product.title,
      description: req.body.description ?? product.description,
      price: req.body.price ? Number(req.body.price) : product.price,
      category: req.body.category ?? product.category,
      condition: req.body.condition ?? product.condition,
      status: req.body.status ?? product.status,
      tags: req.body.tags ? parseArray(req.body.tags) : product.tags,
      location: req.body.location ?? product.location,
    };

    Object.assign(product, updates);

    if (req.files?.length) {
      await attachImages(product, req.files);
      await logActivity({
        type: 'image.upload',
        actor: req.user._id,
        entityType: 'Product',
        entityId: product._id,
        metadata: { count: req.files.length },
      });
    }

    if (req.body.removeImageIds) {
      const idsToRemove = parseArray(req.body.removeImageIds);
      if (idsToRemove.length) {
        product.images = product.images.filter(
          (imgId) => !idsToRemove.includes(String(imgId)),
        );
      }
    }

    await product.save();
    await product.populate('images');

    await logActivity({
      type: 'product.update',
      actor: req.user._id,
      entityType: 'Product',
      entityId: product._id,
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (String(product.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();

    await logActivity({
      type: 'product.delete',
      actor: req.user._id,
      entityType: 'Product',
      entityId: product._id,
    });

    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort('-createdAt')
      .populate('images');

    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};

