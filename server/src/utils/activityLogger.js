const Activity = require('../models/Activity');

const logActivity = async ({ type, actor, entityType, entityId, metadata }) => {
  try {
    await Activity.create({
      type,
      actor,
      entityType,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error('Activity log failed', error);
  }
};

module.exports = logActivity;

