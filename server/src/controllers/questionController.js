const Question = require('../models/Question');
const Product = require('../models/Product');
const logActivity = require('../utils/activityLogger');

const askQuestion = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId).populate('seller');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const question = await Question.create({
      product: product._id,
      seller: product.seller._id,
      askedBy: req.user._id,
      question: req.body.question,
    });

    await logActivity({
      type: 'question.ask',
      actor: req.user._id,
      entityType: 'Question',
      entityId: question._id,
    });

    const populatedQuestion = await question.populate('askedBy', 'name email');

    const io = req.app.get('io');
    io?.to(`product:${product._id}`).emit('question:new', populatedQuestion);

    res.status(201).json(populatedQuestion);
  } catch (error) {
    next(error);
  }
};

const answerQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (String(question.seller) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the seller can answer' });
    }

    question.replies.push({
      message: req.body.answer,
      author: req.user._id,
    });

    await question.save();
    await question.populate('replies.author', 'name');

    await logActivity({
      type: 'question.answer',
      actor: req.user._id,
      entityType: 'Question',
      entityId: question._id,
    });

    const io = req.app.get('io');
    io?.to(`product:${question.product}`).emit('question:answer', question);

    res.json(question);
  } catch (error) {
    next(error);
  }
};

const getProductQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ product: req.params.productId })
      .populate('askedBy', 'name email')
      .populate('replies.author', 'name');
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

const getSellerQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ seller: req.user._id })
      .populate('product', 'title')
      .populate('askedBy', 'name email');
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  answerQuestion,
  getProductQuestions,
  getSellerQuestions,
};

