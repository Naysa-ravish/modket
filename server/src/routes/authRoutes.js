const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  toggleSeller,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.patch('/toggle-seller', protect, toggleSeller);

module.exports = router;

