const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const logActivity = require('../utils/activityLogger');

const allowedDomain = '@modyuniversity.ac.in';

const sanitizeUser = (user) => {
  const plain = user.toObject();
  delete plain.password;
  return plain;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email?.endsWith(allowedDomain)) {
      return res.status(400).json({ message: 'Use your campus email address' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken({ id: user._id });

    await logActivity({
      type: 'user.register',
      actor: user._id,
      entityType: 'User',
      entityId: user._id,
    });

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id });

    await logActivity({
      type: 'user.login',
      actor: user._id,
      entityType: 'User',
      entityId: user._id,
    });

    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = ['name', 'phone', 'bio', 'sellerProfile'].reduce((acc, key) => {
      if (req.body[key] !== undefined) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    await logActivity({
      type: 'user.update',
      actor: user._id,
      entityType: 'User',
      entityId: user._id,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const toggleSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isSeller = !user.isSeller;
    await user.save();

    await logActivity({
      type: 'user.toggleSeller',
      actor: user._id,
      entityType: 'User',
      entityId: user._id,
      metadata: { isSeller: user.isSeller },
    });

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  toggleSeller,
};

