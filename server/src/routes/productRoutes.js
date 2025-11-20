const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require('../controllers/productController');
const { protect, requireSeller } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', listProducts);
router.get('/mine', protect, requireSeller, getSellerProducts);
router.get('/:id', getProduct);
router.post('/', protect, requireSeller, upload.array('images', 5), createProduct);
router.put('/:id', protect, requireSeller, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, requireSeller, deleteProduct);

module.exports = router;

