const express = require('express');
const {
  askQuestion,
  answerQuestion,
  getProductQuestions,
  getSellerQuestions,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, askQuestion);
router.post('/:id/answer', protect, answerQuestion);
router.get('/product/:productId', getProductQuestions);
router.get('/seller', protect, getSellerQuestions);

module.exports = router;

