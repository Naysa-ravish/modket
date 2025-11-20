const Activity = require('../models/Activity');

const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({})
      .sort('-createdAt')
      .limit(25)
      .populate('actor', 'name email');

    res.json(activities);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecentActivities,
};

